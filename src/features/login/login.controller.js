export default class LoginController {
  constructor($scope, $rootScope, FirebaseFactory, $state, Session) {
    Object.assign(this, { $scope, $rootScope, FirebaseFactory, $state, Session});

    // redirecionando direto para o primeiro passo do plano se o usuário
    // já estiver logado
    if (Session.get() && Session.get().uid) this.setCurrentUser(Session.get());
  }

  facebook () {
    this.FirebaseFactory.authFacebook()
      .then((result) => this.setCurrentUser(result.user))
      .catch((error) => this.setCurrentUser({ fail: true }));
  }

  twitter () {
    this.FirebaseFactory.authTwitter()
      .then((result) => this.setCurrentUser(result.user))
      .catch((error) => this.setCurrentUser({ fail: true }));
  }

  setCurrentUser (user) {
    this.$rootScope.currentUser = user;
    this.Session.set(user);

    // direcionando para o primeiro passao do plano se o login for válido
    if (!user.fail) this.$state.go('planoResultado');
  }
}

LoginController.$inject = ['$scope', '$rootScope', 'FirebaseFactory', '$state', 'Session'];
