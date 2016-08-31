routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
  .state('logout', {
    url: '/logout',
    template: require('./logout.html'),
    controller: 'LogoutController',
    controllerAs: 'logout'
  });
}
