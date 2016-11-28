export default class PlanosController {
  constructor($scope, $rootScope, FirebaseFactory, $state, ProjectName, PlanoStatus) {
    Object.assign(this, {$scope, $rootScope, FirebaseFactory, $state, ProjectName, PlanoStatus});

    if (!FirebaseFactory.getAuth()) {
      $state.go('logout');
      return;
    }

    this.lista = [];
    this.noResults = false;

    this.projetos = [];
    this.loadProjects();

    this.statuses = PlanoStatus.getStatuses('REVISOR');
  }

  loadPlanos(projeto) {
    this.noResults = false;
    this.lista = [];

    if (!projeto) return;

    this.$rootScope.isLoading = true;

    this.FirebaseFactory.get(`planos/${projeto}`).then(res => {
      res.json().then(dados => {

        this.$rootScope.isLoading = false;

        if (dados == null) this.noResults = true;

        for (var key in dados) {
          if (dados.hasOwnProperty(key)) {
            let item = {};
            item.plano = dados[key].plano;
            item.status = this.PlanoStatus.getStatus(dados[key].status, 'REVISOR');
            item.uid = key;
            this.lista.push(item);
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

  loadProjects() {
    this.$rootScope.isLoading = true;

    this.FirebaseFactory.get(`admins/${this.FirebaseFactory.getAuth().uid}`).then(res => {
      res.json().then(dados => {

        this.$rootScope.isLoading = false;

        if (dados && (dados.error == 'Auth token is expired')) {
          this.$state.go('logout');
          return;
        }

        for (var key in dados) {
          if (dados.hasOwnProperty(key)) {
            this.projetos.push({
              id: key,
              name: this.ProjectName(key)
            });
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

  getProjectNameById(id) {
    return this.ProjectName(id);
  }

}

PlanosController.$inject = ['$scope', '$rootScope', 'FirebaseFactory', '$state', 'ProjectName', 'PlanoStatus'];
