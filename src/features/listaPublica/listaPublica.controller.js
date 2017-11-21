export default class ListaPublicaController {
  constructor($scope, $rootScope, FirebaseFactory, $state, $stateParams,
              ProjectName, PlanoStatus, $filter, Session, PlanoClassificacao) {
    Object.assign(this, {
      $scope,
      $rootScope,
      FirebaseFactory,
      $state,
      $stateParams,
      ProjectName,
      PlanoStatus,
      $filter,
      Session,
      PlanoClassificacao
    });

    this.isLoading = false;
    this.projeto = this.$stateParams.projeto;
    this.classificacao = this.$stateParams.classificacao;
    this.lista = [];
    this.noResults = false;

    this.classificacoes = [];

    this.loadPlanos();

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

  toggleBloqueio(item, projeto) {
    let bloqueio = !item.bloqueio;

    item.bloqueio = bloqueio;
    this.FirebaseFactory
      .set(`/planos/${projeto}/${item.uid}/bloqueio`, bloqueio);
  }

  loadPlanos() {
    this.noResults = false;
    this.lista = [];

    this.isLoading = true;
    this.$rootScope.isLoading = true;

    var projeto = this.projeto;

    this.FirebaseFactory.get(`planos/${projeto}`)
      .then(res => res.json())
      .then(dados => {

        if (dados == null) this.noResults = true;

        var lista = [];

        for (var key in dados) {
          if (dados.hasOwnProperty(key)) {
            let item = {
              classificacao: {}
            };

            var temClassificacao = false;

            for (var status in this.PlanoClassificacao.STATUSES) {
              if (this.PlanoClassificacao.STATUSES.hasOwnProperty(status)) {
                if ((this.classificacao === status && dados[key][status]) || this.classificacao === 'TODOS') {
                  temClassificacao = true;
                }
                item.classificacao[status] = dados[key][status] || false;
              }
            }

            item.plano = dados[key].plano;
            item.statusKey = dados[key].status;
            item.bloqueio = dados[key].bloqueio || false;

            if (dados[key].revisor) {
              item.revisor = dados[key].revisor.split(' ')[0];
            }

            if (dados[key]['agrupador']) {
              item.agrupador = dados[key]['agrupador'];
            }

            item.status = this.PlanoStatus.getStatus(dados[key].status, 'REVISOR');

            item.uid = key;
            item.plano.dataUltimaAlteracaoFormatada = this.$filter('date')(item.plano.dataUltimaAlteracao, 'medium');

            if (temClassificacao) {
              lista.push(item);
            }
          }
        }

        this.lista = lista;

      })
      .catch(err => {
        console.log('Error:', err);
      })
      .then(() => {
        this.isLoading = false;
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

ListaPublicaController.$inject = [
  '$scope',
  '$rootScope',
  'FirebaseFactory',
  '$state',
  '$stateParams',
  'ProjectName',
  'PlanoStatus',
  '$filter',
  'Session',
  'PlanoClassificacao'
];
