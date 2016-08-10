export default class LoginController {
  constructor($scope, $rootScope, FirebaseFactory, $state) {
    Object.assign(this, { $scope, $rootScope, FirebaseFactory, $state });
  }

  facebook() {
    this.FirebaseFactory.authFacebook()
      .then((result) => this.setCurrentUser(result.user))
      .catch((error) => this.setCurrentUser({ fail: true }));
  }

  twitter() {
    this.FirebaseFactory.authTwitter()
      .then((result) => this.setCurrentUser(result.user))
      .catch((error) => this.setCurrentUser({ fail: true }));
  }

  setCurrentUser(user) {
    this.$rootScope.currentUser = user;
    this.$rootScope.$apply();

    // direcionando para o primeiro passao do plano se o login for válido
    if (!user.fail) this.$state.go('plano01');
  }
}

LoginController.$inject = ['$scope', '$rootScope', 'FirebaseFactory', '$state'];
