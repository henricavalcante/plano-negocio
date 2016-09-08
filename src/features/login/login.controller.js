export default class LoginController {
  constructor($scope, $rootScope, FirebaseFactory, $state, Session) {
    Object.assign(this, { $scope, $rootScope, FirebaseFactory, $state, Session});

    if (FirebaseFactory.getAuth()) $state.go('plano01');
  }

  facebook () {
    this.FirebaseFactory.authFacebook()
      .then((result) => this.setCurrentUser(result));
  }

  twitter () {
    this.FirebaseFactory.authTwitter()
      .then((result) => this.setCurrentUser(result));
  }

  setCurrentUser (user) {
    this.$rootScope.currentUser = user;

    // direcionando para o primeiro passao do plano se o login for válido
    this.$state.go('plano07');
  }
}

LoginController.$inject = ['$scope', '$rootScope', 'FirebaseFactory', '$state', 'Session'];
