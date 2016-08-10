export default class PlanoController {
  constructor($scope, FirebaseFactory) {
    Object.assign(this, { $scope });
  }
}

PlanoController.$inject = ['$scope', 'FirebaseFactory'];
