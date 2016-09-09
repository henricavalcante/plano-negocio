export default class PlanoController {
  constructor($scope, $rootScope, FirebaseFactory, $state) {
    Object.assign(this, { $scope, $rootScope, FirebaseFactory, $state });

    if (!FirebaseFactory.getAuth()) {
      $state.go('logout');
      return;
    }

    $rootScope.currentUser = FirebaseFactory.getAuth();

    this.dados = {};

    this.load();
  }

  save(data) {
    if (!this.$scope.currentUser) {
      console.log('Não Logado!');
      return;
    }

    this.FirebaseFactory.update(
      `${this.$scope.currentUser.uid}/plano`,
      angular.copy(data)
    );
  }

  load () {
    this.FirebaseFactory.get(this.FirebaseFactory.getAuth().uid + '/plano').then((res) => {
      res.json().then((dados) => {
        this.dados = dados;
        this.$scope.$apply();
      });
    });
  }


  // investimento
  adicionarInvestimento (investimento) {
    if (!this.investimentos) {
      this.investimentos = [];
    }

    this.investimentos.push(angular.copy(investimento));
    delete this.$scope.investimento;
    this.$scope.form5.$setPristine();
  }

  removerInvestimento (investimentos) {
    this.investimentos = investimentos.filter(function (investimento) {
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
    if (!this.custos) {
      this.custos = [];
    }

    this.custos.push(angular.copy(custo));
    delete this.$scope.custo;
    this.$scope.form6.$setPristine();
  }

  removerCusto (custos) {
    this.custos = custos.filter(function (custo) {
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
    if (!this.receitas) {
      this.receitas = [];
    }

    this.receitas.push(angular.copy(receita));
    delete this.$scope.receita;
    this.$scope.form8.$setPristine();
  }

  removerReceita (receitas) {
    this.receitas = receitas.filter(function (receita) {
      return !receita.selecionado;
    });
  }

  isReceitaSelecionada (receitas) {
    if (!receitas) return false;

    return receitas.some(function (receita) {
      return receita.selecionado;
    });
  }

  totalGeral (dados) {
    if (!dados) return;

    var total = 0;

    dados.forEach(function (dado) {
      total += (dado.valor * dado.quantidade);
    });

    return total;
  }

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
}

PlanoController.$inject = ['$scope', '$rootScope', 'FirebaseFactory', '$state'];
