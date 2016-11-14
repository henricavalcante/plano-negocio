routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
  .state('planos', {
    url: '/planos',
    template: require('./planos.html'),
    controller: 'PlanosController',
    controllerAs: 'planos'
  });
}
