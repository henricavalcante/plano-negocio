export default class ResetPasswordController {
  constructor($scope, $rootScope, FirebaseFactory) {
    Object.assign(this, { $scope, $rootScope, FirebaseFactory});
  }

  reset(email) {
    this.inProgress = true;
    this.resetStatus = null;
    this.resetStatusMessage = null;

    this.FirebaseFactory.resetPasswordWithEmail(email)
      .then(() => {
        this.resetStatus = true;
        this.inProgress = false;
        this.$scope.$apply();
      })
      .catch(err => {
        this.resetStatus = false;
        switch (err.code) {
          case 'auth/invalid-email':
            this.resetStatusMessage = "E-mail inválido!"
            break;

          case 'auth/user-not-found':
            this.resetStatusMessage = "Usuário não encontrado!"
            break;
        }

        this.inProgress = false;
        this.$scope.$apply();
      });
  }

}

ResetPasswordController.$inject = ['$scope', '$rootScope', 'FirebaseFactory'];
