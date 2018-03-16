export default class PlanosController {
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

    console.log(PlanoClassificacao.setStatus);

    if (!FirebaseFactory.getAuth()) {
      $state.go('logout');
      return;
    }

    this.isLoading = false;

    this.lista = [];
    this.noResults = false;

    this.projetos = [];
    this.loadProjects();

    this.classificacoes = [{
      key: 'SEM_CLASSIFICACAO',
      value: 'Sem classificação'
    }];

    this.resetResumo();

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

  toggleBloqueio(item, projeto) {
    let bloqueio = !item.bloqueio;

    item.bloqueio = bloqueio;
    this.FirebaseFactory
      .set(`/planos/${projeto}/${item.uid}/bloqueio`, bloqueio);
  }

  resetResumo() {
    this.resumo = {
      revisoes: 0,
      plano0Revisoes: 0,
      plano1Revisao: 0,
      plano2Revisoes: 0,
      plano3ouMaisRevisoes: 0,
      status: {}
    }
  }

  atualizarLista(item, projeto, key) {

    let lista = [
      'agrupador',
      'bloqueio',
      'classificacao',
      'status',
      'statusKey'].reduce((lista, attr) => ( lista[attr] = item[attr] || '', lista ), {});

    lista = [
      'userName',
      'nome'].reduce((lista, attr) => ( lista[attr] = item.plano[attr] || '', lista ), lista);

    this.FirebaseFactory.update(`/lista/${projeto}/${key}`, lista);
  }

  loadPlanos(projeto) {
    this.resetResumo();
    this.noResults = false;
    this.lista = [];

    if (!projeto) return;

    this.$scope.criterioDeBusca = '';
    this.saveFilterParam('projetoFiltro', projeto);

    this.$rootScope.isLoading = true;

    this.FirebaseFactory.get(`planos/${projeto}`).then(res => {
      res.json().then(dados => {

        this.$rootScope.isLoading = false;

        if (dados == null) this.noResults = true;

        //this.FirebaseFactory.set(`/lista/${projeto}/`, { 1: 1});

        for (var key in dados) {
          if (dados.hasOwnProperty(key)) {
            let item = {
              classificacao: {}
            };

            for (var status in this.PlanoClassificacao.STATUSES) {
              if (this.PlanoClassificacao.STATUSES.hasOwnProperty(status)) {
                item.classificacao[status] = dados[key][status] || false;
              }
            }

            item.plano = dados[key].plano;
            item.statusKey = dados[key].status;
            item.bloqueio = dados[key].bloqueio || false;

            if (dados[key].revisor) {
              item.revisor = dados[key].revisor.split(' ')[0];
            }

            if (dados[key]['historico']) {
              let revisoes = Object.keys(dados[key]['historico'])
                .map((v) => {
                  if (dados[key]['historico'][v]) {
                    let revisor = dados[key]['historico'][v]['revisor'];
                    if (revisor) {
                      revisor = revisor.split(' ')[0];
                      const url = `plano/visualizar/${projeto}/${key}/${v}`;
                      return {revisor, url};
                    }
                  }
                })
                .filter(v => !!v);
              item.revisoes = revisoes;
              this.resumo.revisoes += revisoes.length;
              switch (revisoes.length) {
                case 1:
                  this.resumo.plano1Revisao++;
                  break;
                case 2:
                  this.resumo.plano2Revisoes++;
                  break;
                default:
                  this.resumo.plano3ouMaisRevisoes++;
              }
            } else {
              this.resumo.plano0Revisoes++;
            }

            if (dados[key]['agrupador']) {
              item.agrupador = dados[key]['agrupador'];
            }

            item.status = this.PlanoStatus.getStatus(dados[key].status, 'REVISOR');

            if (!this.resumo.status[item.status]) {
              this.resumo.status[item.status] = 0
            }
            this.resumo.status[item.status]++;

            item.uid = key;
            item.plano.dataUltimaAlteracaoFormatada = this.$filter('date')(item.plano.dataUltimaAlteracao, 'medium');

            if (dados[key].status === 'REVISADO' && !dados[key]['historico']) {

              this.FirebaseFactory.set(`/planos/${projeto}/${key}/status`, 'ENVIADO_REVISAO');
              item.statusKey = 'ENVIADO_REVISAO'
            }
            
            //this.atualizarLista(item, projeto, key);

            this.lista.push(item);
          }
        }

        this.isLoading = false;
        this.$rootScope.isLoading = false;
        this.$scope.$apply();

      });
    }).catch(err => {
      this.isLoading = false;
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

  saveFilterParam(key, value) {
    this.Session.set(key, value);
  }

  classificarTodos(projetoid, key, status) {
    for (let i=0; i < this.lista.length; i++) {
      if (this.lista[i].checkboxSelected) {
        this.PlanoClassificacao
          .setStatus(projetoid, this.lista[i].uid, key, status)
          .then(() => {
              this.$rootScope.addMensagem('Classificação atualizada com sucesso!', 'success', 2);
              this.$rootScope.$apply();
              if (i = this.lista.length - 1) {
                location.reload();
              }
          })
          .catch(() => {
              this.$rootScope.addMensagem('Problemas ao atualizar a classificação do plano!', 'danger', 4);
              this.$rootScope.$apply();
          })
      }
    }

  }
}

PlanosController.$inject = [
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