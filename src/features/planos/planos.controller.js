export default class PlanosController {
  constructor($scope, $rootScope, FirebaseFactory, $state) {
    Object.assign(this, { $scope, $rootScope, FirebaseFactory, $state});

    if (!FirebaseFactory.getAuth()) {
      $state.go('logout');
      return;
    }

    $rootScope.currentUser = FirebaseFactory.getAuth();

    this.lista = [];
    this.noResults = false;
  }

  loadPlanos(projeto) {
    this.noResults = false;
    this.lista = [];

    if (!projeto) return;

    this.$rootScope.isLoading = true;

    this.FirebaseFactory.get(`planos/${projeto}`).then(res => {
      res.json().then(dados => {

        this.$rootScope.isLoading = false;
        if (dados && (dados.error == 'Auth token is expired')) {
          this.$state.go('logout');
          return;
        }

        if (dados == null)  this.noResults = true;

        for (var key in dados) {
          if (dados.hasOwnProperty(key)) {
            let plano = dados[key].plano;
            plano.uid = key;
            this.lista.push(plano);
          }
        }

        this.$rootScope.isLoading = false;
        this.$scope.$apply();

      });
    }).catch(err => {
      this.$rootScope.isLoading = false;
      console.log('Error:', err);
    });
  }

}

PlanosController.$inject = ['$scope', '$rootScope', 'FirebaseFactory', '$state'];
