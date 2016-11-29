export default class LogoutController {
  constructor($scope, $rootScope, $state, Session, FirebaseFactory) {
    Object.assign(this, { $scope, $rootScope, $state, Session, FirebaseFactory});

    Session.clear();

    $rootScope.planoStatus = null;

    FirebaseFactory.signOut().then(() => {
        $state.go('login');
    }).catch(() => {
      console.log('erro ao deslogar');
    });

  }
}

LogoutController.$inject = ['$scope', '$rootScope', '$state', 'Session', 'FirebaseFactory'];
