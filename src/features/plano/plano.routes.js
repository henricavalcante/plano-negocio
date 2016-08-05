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
    });
}
