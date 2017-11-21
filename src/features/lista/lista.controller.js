export default class ListaController {
  constructor($scope, $rootScope, FirebaseFactory, $state, ProjectName, PlanoStatus, $filter, Session, PlanoClassificacao) {
    Object.assign(this, {
      $scope,
      $rootScope,
      FirebaseFactory,
      $state,
      ProjectName,
      PlanoStatus,
      $filter,
      Session,
      PlanoClassificacao
    });

    if (!FirebaseFactory.getAuth()) {
      $state.go('logout');
      return;
    }

    this.isLoading = false;

    this.lista = [];
    this.noResults = false;

    this.projetos = [];
    this.loadProjects();

    this.classificacoes = [];
    this.classificacaofiltro = '';

    for (var key in PlanoClassificacao.STATUSES) {
      if (PlanoClassificacao.STATUSES.hasOwnProperty(key)) {
        this.classificacoes.push({
          key: key,
          value: PlanoClassificacao.STATUSES[key]
        });
      }
    }

    this.statuses = PlanoStatus.getStatuses('REVISOR');

    this.order = {};
    this.currentSort = {};

    // carregando filtros salvos na sessão
    $scope.projetofiltro = Session.get('projetoFiltro');
    $scope.criterioDeBusca = Session.get('criterioDeBuscaFiltro') || '';
    $scope.statusfiltro = Session.get('statusfiltro');

    if ($scope.projetofiltro) {
      this.isLoading = true;
      this.loadPlanos($scope.projetofiltro);
    }
  }

  sort(column) {
    if (this.order[column] == column) {
      this.order[column + 'Desc'] = !this.order[column + 'Desc'];
    } else {
      this.order[column] = column;
      this.order[column + 'Desc'] = false;
    }

    this.currentSort = {exp: this.order[column], reverse: this.order[column + 'Desc']};
  }

  loadPlanos(projeto) {

    this.noResults = false;
    this.lista = [];

    if (!projeto) return;

    this.projeto = this.getProjectNameById(projeto);

    this.$scope.criterioDeBusca = '';
    this.saveFilterParam('projetoFiltro', projeto);

    this.$rootScope.isLoading = true;

    this.FirebaseFactory.get(`lista/${projeto}`)
      .then(res => res.json())
      .then(planos => Object.keys(planos).map(plano => planos[plano]))
      .then(planos => {
        this.lista = planos;
      })
      .catch(err => {
        console.log('Error:', err);
      })
      .then(() => {
        this.$rootScope.isLoading = false;
        this.isLoading = false;
        this.$scope.$apply();
      });
  }

  loadProjects() {
    this.$rootScope.isLoading = true;

    this.FirebaseFactory.get(`admins/${this.FirebaseFactory.getAuth().uid}`)
      .then(res => res.json())
      .then(dados => {

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
      })
      .catch(err => {
        this.$rootScope.isLoading = false;
        console.log('Error:', err);
      })
      .then(() => {
        this.$rootScope.isLoading = false;
        this.$scope.$apply();
      });
  }

  getProjectNameById(id) {
    return this.ProjectName(id);
  }

  saveFilterParam(key, value) {
    this.Session.set(key, value);
  }

}

ListaController.$inject = [
  '$scope',
  '$rootScope',
  'FirebaseFactory',
  '$state',
  'ProjectName',
  'PlanoStatus',
  '$filter',
  'Session',
  'PlanoClassificacao'
];
