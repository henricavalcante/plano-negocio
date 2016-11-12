export default class RevisarController {
  constructor($scope, $stateParams, FirebaseFactory) {
    Object.assign(this, {$scope, FirebaseFactory});

    this.loadPlano($stateParams.projeto, $stateParams.uid);

  }

  loadPlano(projeto, uid) {
    this
      .FirebaseFactory
      .get(`/planos/${projeto}/${uid}`)
      .then(res => {
        res.json().then(dados => {
          this.plano = dados.plano;
          this.$scope.$apply();
        });

      })
      .catch(err => {
        console.error('Error:', err);
      });
  }

}

RevisarController.$inject = ['$scope', '$stateParams', 'FirebaseFactory'];
