export default class PlanoController {
  constructor($scope, $rootScope, FirebaseFactory, $state) {
    Object.assign(this, { $scope, $rootScope, FirebaseFactory, $state });

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
  }

  save(data) {
    this.$rootScope.isLoading = true;

    if (!this.$scope.currentUser) {
      console.log('Não Logado!');
      return;
    }

    this.FirebaseFactory.update(
      `${this.$scope.currentUser.uid}/plano`,
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

  load () {
    this.$rootScope.isLoading = true;

    this.FirebaseFactory.get(this.FirebaseFactory.getAuth().uid + '/plano').then((res) => {
      res.json().then((dados) => {
        this.dados = dados;
        this.$rootScope.isLoading = false;
        this.$scope.$apply();
      });
    });
  }

  // investimento
  adicionarInvestimento (investimento) {
    if (!this.dados.investimentos) {
      this.dados.investimentos = [];
    }

    this.dados.investimentos.push(angular.copy(investimento));
    this.form05.$setPristine();
    delete this.$scope.investimento;
  }

  removerInvestimento (investimentos) {
    this.dados.investimentos = investimentos.filter(function (investimento) {
      return !investimento.selecionado;
    });
  }

  isInvestimentoSelecionado (investimentos) {
    if (!investimentos) return false;

    return investimentos.some(function (investimento) {
      return investimento.selecionado;
    });
  }

  // custos
  adicionarCusto (custo) {
    if (!this.dados.custos) {
      this.dados.custos = [];
    }

    this.dados.custos.push(angular.copy(custo));
    delete this.$scope.custo;
    this.form06.$setPristine();
  }

  removerCusto (custos) {
    this.dados.custos = custos.filter(function (custo) {
      return !custo.selecionado;
    });
  }

  isCustoSelecionado (custos) {
    if (!custos) return false;

    return custos.some(function (custo) {
      return custo.selecionado;
    });
  }

  // receitas
  adicionarReceita (receita) {
    if (!this.dados.receitas) {
      this.dados.receitas = [];
    }

    this.dados.receitas.push(angular.copy(receita));
    delete this.$scope.receita;
    this.form08.$setPristine();
  }

  removerReceita (receitas) {
    this.dados.receitas = receitas.filter(function (receita) {
      return !receita.selecionado;
    });
  }

  isReceitaSelecionada (receitas) {
    if (!receitas) return false;

    return receitas.some(function (receita) {
      return receita.selecionado;
    });
  }

  // retorna o resultado geral com os calculos de valor x quantidade do
  // itens passados por parâmetro
  totalGeral (dados) {
    if (!dados) return;

    var total = 0;

    dados.forEach(function (dado) {
      total += (dado.valor * dado.quantidade);
    });

    return total;
  }

  // retorna um total simples baseado nos calores passados por parâmetro
  totalSimples (dados) {
    if (!dados) return;

    var total = 0;

    for (var key in dados) {
      if (dados.hasOwnProperty(key)) {
        total += dados[key];
      }
    }

    return total;
  }

  passosConcluidos () {
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
      if (!this.dados[key]) stop = true;

      if (stop) return;

      switch (i) {
        case 1: passos.plano01 = true; break;
        case 3: passos.plano02 = true; break;
        case 5: passos.plano03 = true; break;
        case 7: passos.plano04 = true; break;
        case 8: passos.plano05 = true; break;
        case 9: passos.plano06 = true; break;
        case 10: passos.plano07 = true; break;
        case 11: passos.plano08 = true; break;
      }
    });

    return passos;

  }

}

PlanoController.$inject = ['$scope', '$rootScope', 'FirebaseFactory', '$state'];
