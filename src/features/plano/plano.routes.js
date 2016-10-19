routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
  .state('plano01', {
    url: '/plano/01',
    template: require('./01.html'),
    controller: 'PlanoController',
    controllerAs: 'plano'
  })
  .state('plano02', {
    url: '/plano/02',
    template: require('./02.html'),
    controller: 'PlanoController',
    controllerAs: 'plano'
  })
  .state('plano03', {
    url: '/plano/03',
    template: require('./03.html'),
    controller: 'PlanoController',
    controllerAs: 'plano'
  })
  .state('plano04', {
    url: '/plano/04',
    template: require('./04.html'),
    controller: 'PlanoController',
    controllerAs: 'plano'
  })
  .state('plano05', {
    url: '/plano/05',
    template: require('./05.html'),
    controller: 'PlanoController',
    controllerAs: 'plano'
  })
  .state('plano06', {
    url: '/plano/06',
    template: require('./06.html'),
    controller: 'PlanoController',
    controllerAs: 'plano'
  })
  .state('plano07', {
    url: '/plano/07',
    template: require('./07.html'),
    controller: 'PlanoController',
    controllerAs: 'plano'
  })
  .state('plano08', {
    url: '/plano/08',
    template: require('./08.html'),
    controller: 'PlanoController',
    controllerAs: 'plano'
  })
  .state('planoResultado', {
    url: '/plano/resultado',
    template: require('./09.html'),
    controller: 'PlanoController',
    controllerAs: 'plano'
  })
  .state('visualizar', {
    url: '/plano/visualizar',
    template: require('./visualizar.html'),
    controller: 'PlanoController',
    controllerAs: 'plano'
  });
}
