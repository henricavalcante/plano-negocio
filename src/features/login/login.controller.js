export default class LoginController {
  constructor($scope, $rootScope, FirebaseFactory, $state, Session) {
    Object.assign(this, { $scope, $rootScope, FirebaseFactory, $state, Session});

    if (FirebaseFactory.getAuth()) $rootScope.currentUser = FirebaseFactory.getAuth;
  }

  signInWithEmailAndPassword (user) {
    this.$rootScope.loginErrorMessage = null;

    this.FirebaseFactory.signInWithEmailAndPassword(user.email, user.password)
      .then(result => this.setCurrentUser(result))
      .catch((err) => {
        switch (err.code) {
          case 'auth/wrong-password':
            this.$rootScope.loginErrorMessage = 'E-mail ou senha incorreto!';
            break;

          case 'auth/user-not-found':
            this.createUserWithEmailAndPassword(user);
            break;

          default:
            this.$rootScope.loginErrorMessage = 'Ocorreu um erro, tente novamente!';

        }

        this.$rootScope.$apply();
      });
  }

  createUserWithEmailAndPassword (user) {
    this.FirebaseFactory.createUserWithEmailAndPassword(user.email, user.password)
      .then(result => this.setCurrentUser(result))
      .catch((err) => {
        this.$rootScope.loginErrorMessage = 'Ocorreu um erro, tente novamente!2';
        this.$rootScope.$apply();
      });

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
    this.Session.set(user);
    this.$rootScope.currentUser = user;

    // direcionando para o primeiro passao do plano se o login for válido
    this.$state.go('plano01');
  }
}

LoginController.$inject = ['$scope', '$rootScope', 'FirebaseFactory', '$state', 'Session'];
