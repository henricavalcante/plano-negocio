export default class PlanoController {
  constructor($scope, FirebaseFactory, $state) {
    Object.assign(this, { $scope, FirebaseFactory, $state });

    this.$scope.dados = {};
    this.$scope.dados.investimentos = [];

    if (!$scope.currentUser) $state.go('login');
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

  adicionarInvestimento (investimento) {
    this.$scope.dados.investimentos.push(angular.copy(investimento));
    delete this.$scope.investimento;
    this.$scope.form.$setPristine();
  }

  removerInvestimento (investimentos) {
    console.log(investimentos);
    this.$scope.dados.investimentos = investimentos.filter(function (investimento) {
      return !investimento.selecionado;
    });
  }

  isInvestimentoSelecionado (investimentos) {
    return investimentos.some(function (investimento) {
      return investimento.selecionado;
    });
  }
}

PlanoController.$inject = ['$scope', 'FirebaseFactory', '$state'];
