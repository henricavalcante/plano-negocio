export default class LogoutController {
  constructor($scope, $rootScope, $state, Session) {
    Object.assign(this, { $scope, $rootScope, $state, Session});

    $rootScope.currentUser = undefined;
    Session.clear();

    setTimeout(function () {
      $state.go('login');
    }, 1000);
  }
}

LogoutController.$inject = ['$scope', '$rootScope', '$state', 'Session'];
