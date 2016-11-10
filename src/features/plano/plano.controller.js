export default class PlanoController {
  constructor($scope, $rootScope, FirebaseFactory, $state) {
    Object.assign(this, {$scope, $rootScope, FirebaseFactory, $state});

    if (!FirebaseFactory.getAuth()) {
      $state.go('logout');
      return;
    }

    $rootScope.currentUser = FirebaseFactory.getAuth();

    $rootScope.mensagens = [];

    $rootScope.removerMensagem = (mensagem) => {
      $rootScope.mensagens = $rootScope.mensagens.filter((_mensagem) => {
        return _mensagem.id != mensagem.id;
      });
    };

    this.dados = {};

    this.load();

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
  }

  save(data) {
    this.$rootScope.isLoading = true;

    if (!this.$scope.currentUser) {
      console.log('Não Logado!');
      return;
    }

    data.userName = this.$scope.currentUser.displayName || this.$scope.userName || ' ';

    this.FirebaseFactory.update(
      this.getPath(),
      angular.copy(data)
    ).then(() => {
      this.$rootScope.mensagens.push({
        id: this.$rootScope.mensagens.length,
        text: 'Dados salvos com sucesso! Você pode prosseguir para o próximo passo!'
      });

      this.$rootScope.isLoading = false;
      this.$scope.$apply();
    });
  }

  load() {
    this.$rootScope.isLoading = true;

    this.FirebaseFactory.get(this.getPath()).then(res => {
      res.json().then(dados => {

        this.$rootScope.isLoading = false;

        if (dados && dados.error) {
          this.$state.go('logout');
          return;
        }

        if (dados) {
          this.dados = dados;
          this.receitas = this.totalGeral(dados.receitas);
          this.custosVariaveisTotais = this.totalGeral(dados.custos);
          this.custosFixosTotais = this.totalSimples(dados.custosFixos);
          this.despesas = this.custosVariaveisTotais + this.custosFixosTotais;
          this.margemDeContribuicao = this.receitas - this.custosVariaveisTotais;
          this.resultadoOperacional = this.margemDeContribuicao - this.custosFixosTotais;
          this.lucro = this.receitas - this.despesas;
          this.capitalDeGiro = this.despesas * 3;
          this.investimento = this.totalGeral(dados.investimentos);
          this.investimentoTotal = this.investimento + this.capitalDeGiro;
          this.taxaDeRetorno = this.investimentoTotal / this.lucro;
        }
        this.$scope.$apply();
      });
    }).catch(err => {
      console.log('Error:', err);
    });
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
    return dados.reduce((p, x)=> p + (x.valor * x.quantidade), 0);
  }

  totalSimples(dados) {
    if (!dados) return;
    return Object.keys(dados).reduce((p, x)=> p + dados[x], 0);
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

  getPath() {
    return `planos/${this.$rootScope.projeto}/${this.$scope.currentUser.uid}/plano`;
  }

}

PlanoController.$inject = ['$scope', '$rootScope', 'FirebaseFactory', '$state'];
