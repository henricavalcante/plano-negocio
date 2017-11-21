routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
  .state('lista', {
    url: '/lista',
    template: require('./lista.html'),
    controller: 'ListaController',
    controllerAs: 'lista'
  });
}