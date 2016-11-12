routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
  .state('revisar', {
    url: '/revisar/:projeto/:uid',
    template: require('./revisar.html'),
    controller: 'RevisarController',
    controllerAs: 'revisar'
  });
}
