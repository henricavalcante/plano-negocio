routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
  .state('listaPublica', {
    url: '/listaPublica/:projeto/:classificacao',
    template: require('./listaPublica.html'),
    controller: 'ListaPublicaController',
    controllerAs: 'planos'
  });
}
