export default class CorrecaoController {
  constructor($scope, $rootScope, FirebaseFactory) {
    Object.assign(this, { $scope, $rootScope, FirebaseFactory});

    this.alunos = null;

    this.loadAlunos();

  }

  loadAlunos() {
    this.FirebaseFactory.get('/users').then(res => {
      res.json().then(dados => {

        this.$rootScope.isLoading = false;

        if (dados && dados.error) {
          this.$state.go('logout');
          return;
        }

        this.alunos = dados;

        this.$scope.$apply();

      });
    }).catch(err => {
      console.log('Error:', err);
    });
  }

}

CorrecaoController.$inject = ['$scope', '$rootScope', 'FirebaseFactory'];
