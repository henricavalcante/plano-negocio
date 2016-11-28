export default class LoginController {
  constructor($scope, $rootScope, FirebaseFactory, $state, Session, $location) {
    Object.assign(this, {$scope, $rootScope, FirebaseFactory, $state, Session, $location});

    this.isIframe = self!=top;

    var queryStringUser = $location.search();

    if (queryStringUser.email && queryStringUser.key) {

      // Mostra a tela de 'loading' quando o app for usado dentro da plataforma
      // wiquadro, para não mostrar o formulário de login enquanto o login via
      // querystring é feito
      $rootScope.isLoading = true;

      Session.clear();
      Session.set('projeto', queryStringUser.projeto);
      Session.set('userName', queryStringUser.nome);

      this.signInWithEmailAndPassword(queryStringUser);
    }

    if (FirebaseFactory.getAuth()) {
      var currentUser = FirebaseFactory.getAuth();
      this.Session.upsertCurrentUser(currentUser);
      $state.go('plano01');
    }
  }

  signInWithEmailAndPassword(user) {
    if (user.key) user.password = user.key;

    this.$rootScope.loginErrorMessage = null;

    this.FirebaseFactory.signInWithEmailAndPassword(user.email, user.password)
      .then(result => {
        this.setCurrentUser(result);
      })
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

  createUserWithEmailAndPassword(user) {
    this.FirebaseFactory.createUserWithEmailAndPassword(user.email, user.password)
      .then(result => {
        this.setCurrentUser(result);
        this.Session.upsertCurrentUser(result);
        this.Session.set('projeto', this.$rootScope.projeto);
        this.FirebaseFactory.set(`users/${result.uid}`, user);
      })
      .catch(() => {
        this.$rootScope.loginErrorMessage = 'Ocorreu um erro, tente novamente!';
        this.$rootScope.$apply();
      });
  }

  facebook() {
    this.FirebaseFactory.authFacebook()
      .then((result) => this.setCurrentUser(result));
  }

  twitter() {
    this.FirebaseFactory.authTwitter()
      .then((result) => this.setCurrentUser(result));
  }

  setCurrentUser(user) {
    user.getToken(true);
    console.log('Código do utilizador: ', user.uid);

    this.Session.set('currentUser', user);

    this.$state.go('plano01');
  }
}

LoginController.$inject = ['$scope', '$rootScope', 'FirebaseFactory', '$state', 'Session', '$location'];
