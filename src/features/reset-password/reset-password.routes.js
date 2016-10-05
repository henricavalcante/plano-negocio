routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
  .state('reset-password', {
    url: '/reset-password',
    template: require('./reset-password.html'),
    controller: 'ResetPasswordController',
    controllerAs: 'resetPassword'
  });
}
