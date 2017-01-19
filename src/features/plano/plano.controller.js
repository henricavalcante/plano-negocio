export default class PlanoController {
  constructor($scope, $rootScope, FirebaseFactory, $state, $stateParams, Session, PlanoStatus) {
    Object.assign(this, {$scope, $rootScope, FirebaseFactory, $state, $stateParams, Session, PlanoStatus});

    if (!FirebaseFactory.getAuth()) {
      $state.go('logout');
      return;
    }

    this.dados = {};

    this.load($stateParams.projeto, $stateParams.uid, $stateParams.versao);

    this.requerimentos = [
      'nome',
      'atividade',
      'produtos',
      'clientes',
      'concorrentes',
      'fornecedores',
      'localizacao',
      'divulgacao',
      'investimentos',
      'custos',
      'custosFixos',
      'receitas'
    ];

    this.$scope.editMode = false;

    this.$scope.$watch('plano.dados.custosFixos.maoDeObra', (a) => {
      if (this.dados.custosFixos) {
        this.dados.custosFixos.encargos = a * 0.04;
      }
    });

    this.tipoUsuario = this.Session.get('tipoUsuario');
  }

  save(data) {
    this.$rootScope.isLoading = true;

    if (!this.FirebaseFactory.getAuth()) {
      console.log('Não Logado!');
      return;
    }

    data.userName = this.FirebaseFactory.getAuth().displayName || this.Session.get('userName') || ' ';

    data.dataUltimaAlteracao = this.FirebaseFactory.getServerDate();

    let todosOsPassosConcluidos = this.passosConcluidos().plano08;

    let dados = {
      plano: angular.copy(data),
      status: todosOsPassosConcluidos ? this.PlanoStatus.STATUSES.ELABORADO : this.PlanoStatus.STATUSES.ELABORANDO,
      agrupador: this.Session.get('agrupador')
    };

    this.FirebaseFactory.update(
      this.getPath(),
      dados
    ).then(() => {
      this.$rootScope.addMensagem('Dados salvos com sucesso! Você pode prosseguir para o próximo passo!');

      this.$rootScope.isLoading = false;
      this.$scope.$apply();
    });
  }

  load(projetoid, userid, versao) {
    this.$rootScope.isLoading = true;

    this.FirebaseFactory.get(this.getPath(projetoid, userid)).then(res => {
      res.json().then(dados => {

        this.$rootScope.isLoading = false;

        if (dados) {

          this.$rootScope.planoStatus = this.PlanoStatus.getStatus(dados.status, this.Session.get('tipoUsuario'));
          this.status = dados.status;
          this.bloqueio = dados.bloqueio;
          this.revisao = versao ? dados.historico[versao].revisao : dados.revisao;
          this.dados = versao ? dados.historico[versao].plano : dados.plano;

          document.title = 'Plano de Negócio - ' + dados.plano.nome;

          this.receitas = this.totalGeral(dados.plano.receitas);
          this.custosVariaveisTotais = this.totalGeral(dados.plano.custos);
          this.custosFixosTotais = this.totalSimples(dados.plano.custosFixos) * 1.05;
          this.investimento = this.totalGeral(dados.plano.investimentos);

          this.mesesCapitalDeGiro = this.Session.get('mesesCapitalDeGiro') || 2;

          this.updateTotals();

          this.$scope.$watch('plano.mesesCapitalDeGiro', (a) => {
            this.Session.set('mesesCapitalDeGiro', this.mesesCapitalDeGiro);
            this.updateTotals();
          });

          this.mostrarCorrecao = this.Session.get('visualizacaoMostrarCorrecao');

          this.$scope.$watch('plano.mostrarCorrecao', (a) => {
            this.Session.set('visualizacaoMostrarCorrecao', this.mostrarCorrecao);
            this.updateTotals();
          });
        }

        if (this.status == this.PlanoStatus.REVISADO) {
          if (this.bloqueio) {
            this.$rootScope.addMensagem('Seu plano foi revisado e não é mais possível enviar novamente para correção.', 'warning', 10);
          }
          else {
            this.$rootScope.addMensagem('Seu plano foi revisado, promova as alterações necessárias e envie novamente para a correção.', 'warning', 10);
          }
        }

        this.$scope.$apply();
      });
    }).catch(err => {
      console.log('Error:', err);
    });
  }

  updateTotals(dados) {
    this.despesas = this.custosVariaveisTotais + this.custosFixosTotais;
    this.margemDeContribuicao = this.receitas - this.custosVariaveisTotais;
    this.resultadoOperacional = this.margemDeContribuicao - this.custosFixosTotais;
    this.lucro = this.receitas - this.despesas;
    this.capitalDeGiro = this.despesas * this.mesesCapitalDeGiro;
    this.investimentoTotal = this.investimento + this.capitalDeGiro;
    this.taxaDeRetorno = this.investimentoTotal / this.lucro;
  }

  // investimento
  adicionarInvestimento(investimento) {
    if (!this.dados.investimentos) {
      this.dados.investimentos = [];
    }

    if (this.form05.$invalid) return;

    this.dados.investimentos.push(angular.copy(investimento));
    this.form05.$setPristine();
    delete this.investimentoItem;

    this.save(this.dados)
  }

  editarInvestimento(investimento) {
    this.$scope.editingKey = investimento['$$hashKey'];
    this.$scope.editMode = !this.$scope.editMode;
    this.investimentoItem = angular.copy(investimento);
  }

  salvarInvestimento(investimento) {
    if (this.form05.$invalid) return;

    this.dados.investimentos.forEach((item, i) => {
      if (item['$$hashKey'] == this.$scope.editingKey
      ) {
        this.dados.investimentos[i] = angular.copy(investimento);
      }
    });

    this.cancelarEdicaoInvestimento();

    this.save(this.dados)
  }

  cancelarEdicaoInvestimento() {
    this.$scope.editMode = false;
    this.$scope.editingKey = null;

    this.form05.$setPristine();
    delete this.investimentoItem;
  }

  removerInvestimento(investimentos) {
    this.dados.investimentos = investimentos.filter(function (investimento) {
      return !investimento.selecionado;
    });

    this.save(this.dados)
  }

  isInvestimentoSelecionado(investimentos) {
    if (!investimentos) return false;

    return investimentos.some(function (investimento) {
      return investimento.selecionado;
    });
  }

  // custos
  adicionarCusto(custo) {
    if (!this.dados.custos) {
      this.dados.custos = [];
    }

    if (this.form06.$invalid) return;

    this.dados.custos.push(angular.copy(custo));
    this.form06.$setPristine();
    delete this.custo;

    this.save(this.dados);
  }

  editarCusto(custo) {
    this.$scope.editingKey = custo['$$hashKey'];
    this.$scope.editMode = !this.$scope.editMode;
    this.custo = angular.copy(custo);
  }

  salvarCusto(custo) {
    if (this.form06.$invalid) return;

    this.dados.custos.forEach((item, i) => {
      if (item['$$hashKey'] == this.$scope.editingKey) {
        this.dados.custos[i] = angular.copy(custo);
      }
    });

    this.cancelarEdicaoCusto();

    this.save(this.dados);
  }

  cancelarEdicaoCusto() {
    this.$scope.editMode = false;
    this.$scope.editingKey = null;

    this.form06.$setPristine();
    delete this.custo;
  }

  removerCusto(custos) {
    this.dados.custos = custos.filter(function (custo) {
      return !custo.selecionado;
    });

    this.save(this.dados);
  }

  isCustoSelecionado(custos) {
    if (!custos) return false;

    return custos.some(function (custo) {
      return custo.selecionado;
    });
  }

  // receitas
  adicionarReceita(receita) {
    if (!this.dados.receitas) {
      this.dados.receitas = [];
    }

    if (this.form08.$invalid) return;

    this.dados.receitas.push(angular.copy(receita));
    this.form08.$setPristine();
    delete this.receita;

    this.save(this.dados);
  }

  editarReceita(receita) {
    this.$scope.editingKey = receita['$$hashKey'];
    this.$scope.editMode = !this.$scope.editMode;
    this.receita = angular.copy(receita);
  }

  salvarReceita(receita) {
    if (this.form08.$invalid) return;

    this.dados.receitas.forEach((item, i) => {
      if (item['$$hashKey'] == this.$scope.editingKey) {
        this.dados.receitas[i] = angular.copy(receita);
      }
    });

    this.cancelarEdicaoReceita();

    this.save(this.dados);
  }

  cancelarEdicaoReceita() {
    this.$scope.editMode = false;
    this.$scope.editingKey = null;

    this.form08.$setPristine();
    delete this.receita;
  }

  removerReceita(receitas) {
    this.dados.receitas = receitas.filter(function (receita) {
      return !receita.selecionado;
    });

    this.save(this.dados);
  }

  isReceitaSelecionada(receitas) {
    if (!receitas) return false;

    return receitas.some(function (receita) {
      return receita.selecionado;
    });
  }

  totalGeral(dados) {
    if (!dados) return;
    return dados.reduce((p, x)=> p + (this.toMoney(x.valor) * this.toMoney(x.quantidade)), 0);
  }

  totalSimples(dados) {
    if (!dados) return;
    return Object.keys(dados).reduce((p, x)=> p + this.toMoney(dados[x]), 0);
  }

  toMoney(v) {
    return parseFloat(v) || 0;
  }

  passosConcluidos() {
    let passos = {
      plano01: false,
      plano02: false,
      plano03: false,
      plano04: false,
      plano05: false,
      plano06: false,
      plano07: false,
      plano08: false
    }

    if (!this.dados) return passos;

    let stop = false;

    this.requerimentos.forEach((key, i) => {
      if (!this.dados[key]) {
        stop = true;
      }

      if (stop) {
        return;
      }

      switch (i) {
        case 1:
          passos.plano01 = true;
          break;
        case 3:
          passos.plano02 = true;
          break;
        case 5:
          passos.plano03 = true;
          break;
        case 7:
          passos.plano04 = true;
          break;
        case 8:
          passos.plano05 = true;
          break;
        case 9:
          passos.plano06 = true;
          break;
        case 10:
          passos.plano07 = true;
          break;
        case 11:
          passos.plano08 = true;
          break;
      }
    });

    return passos;

  }

  getPath(projetoid, userid) {
    let pid = projetoid || this.Session.get('projeto') || 'semprojeto';
    let uid = userid || this.FirebaseFactory.getAuth().uid;

    return `planos/${pid}/${uid}`;
  }

  bloqueadoParaEditar() {
    return this.status === this.PlanoStatus.STATUSES.ENVIADO_REVISAO;
  }

}

PlanoController.$inject = [
  '$scope',
  '$rootScope',
  'FirebaseFactory',
  '$state',
  '$stateParams',
  'Session',
  'PlanoStatus'
];
