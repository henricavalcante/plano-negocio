routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
  .state('correcao', {
    url: '/correcao',
    template: require('./correcao.html'),
    controller: 'CorrecaoController',
    controllerAs: 'correcao'
  });
}
