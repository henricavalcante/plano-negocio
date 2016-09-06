export default class PlanoController {
  constructor($scope, FirebaseFactory, $state) {
    Object.assign(this, { $scope, FirebaseFactory, $state });

    if (!$scope.currentUser) {
      $state.go('login');
      return;
    }

    $scope.dados = {};

    var data = FirebaseFactory.get($scope.currentUser.uid + '/plano');
    data.on('value', function (snapshot) {
      if (snapshot.val() == null) return;

      $scope.dados = snapshot.val();
    });
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


  // investimento
  adicionarInvestimento (investimento) {
    if (!this.$scope.dados.investimentos) {
      this.$scope.dados.investimentos = [];
    }

    this.$scope.dados.investimentos.push(angular.copy(investimento));
    delete this.$scope.investimento;
    this.$scope.form5.$setPristine();
  }

  removerInvestimento (investimentos) {
    this.$scope.dados.investimentos = investimentos.filter(function (investimento) {
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
    if (!this.$scope.dados.custos) {
      this.$scope.dados.custos = [];
    }

    this.$scope.dados.custos.push(angular.copy(custo));
    delete this.$scope.custo;
    this.$scope.form6.$setPristine();
  }

  removerCusto (custos) {
    this.$scope.dados.custos = custos.filter(function (custo) {
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
    if (!this.$scope.dados.receitas) {
      this.$scope.dados.receitas = [];
    }

    this.$scope.dados.receitas.push(angular.copy(receita));
    delete this.$scope.receita;
    this.$scope.form8.$setPristine();
  }

  removerReceita (receitas) {
    this.$scope.dados.receitas = receitas.filter(function (receita) {
      return !receita.selecionado;
    });
  }

  isReceitaSelecionada (receitas) {
    if (!receitas) return false;

    return receitas.some(function (receita) {
      return receita.selecionado;
    });
  }
}

PlanoController.$inject = ['$scope', 'FirebaseFactory', '$state'];
