export default class RevisarController {
  constructor($scope, $rootScope, $stateParams, FirebaseFactory, $state, PlanoStatus) {
    Object.assign(this, {$scope, $rootScope, FirebaseFactory, $state, PlanoStatus});

    this.projeto = $stateParams.projeto;
    this.uid = $stateParams.uid;

    this.loadPlano(this.projeto, this.uid);

  }

  loadPlano(projeto, uid) {
    this
      .FirebaseFactory
      .get(`/planos/${projeto}/${uid}`)
      .then(res => {
        res.json().then(dados => {

          if (dados && dados.error) {
            this.$state.go('logout');
            return;
          }

          this.plano = dados.plano;
          this.revisao = dados.revisao;

          this.$scope.$apply();
        });

      })
      .catch(err => {
        console.error('Error:', err);
      });
  }

  saveRevisao(revisao) {
    if (!revisao) return;

    this
      .FirebaseFactory
      .update(`/planos/${this.projeto}/${this.uid}`, {
        revisao: revisao,
        status: this.PlanoStatus.STATUSES.REVISANDO
      })
      .then(() => {
        this.$rootScope.mensagens.push({
          id: this.$rootScope.mensagens.length,
          text: 'Revisão salva com sucesso!'
        });

        this.$rootScope.isLoading = false;
        this.$scope.$apply();
      });
  }

  finishRevisao(plano, revisao) {
    plano = angular.copy(plano);
    revisao = angular.copy(revisao);
    this
      .PlanoStatus
      .setStatus(this.projeto, this.uid, this.PlanoStatus.STATUSES.REVISADO)
      .then(
        () => this
          .FirebaseFactory
          .get(`/planos/${this.projeto}/${this.uid}/historico`)
      )
      .then((res) => res.json())
      .then((json) => {
        if (json && typeof json === 'object') {
          return Object.keys(json).length;
        } else {
          return 1;
        }
      })
      .then((key) => {
        this
          .FirebaseFactory
          .set(`/planos/${this.projeto}/${this.uid}/historico/${key}`, {
            plano, revisao
          })
      })
  }

}

RevisarController.$inject = ['$scope', '$rootScope', '$stateParams', 'FirebaseFactory', '$state', 'PlanoStatus'];
