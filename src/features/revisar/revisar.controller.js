export default class RevisarController {
  constructor($scope, $rootScope, $stateParams, FirebaseFactory, $state) {
    Object.assign(this, {$scope, $rootScope, FirebaseFactory, $state});

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
      .update(`/planos/${this.projeto}/${this.uid}`, {revisao: revisao})
      .then(() => {
        this.$rootScope.mensagens.push({
          id: this.$rootScope.mensagens.length,
          text: 'Revisão salva com sucesso!'
        });

        this.$rootScope.isLoading = false;
        this.$scope.$apply();
      });
  }

}

RevisarController.$inject = ['$scope', '$rootScope', '$stateParams', 'FirebaseFactory', '$state'];
