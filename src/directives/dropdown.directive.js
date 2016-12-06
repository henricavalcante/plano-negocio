import angular from 'angular';
import './dropdown.css'

function dropdown() {
  const controller = function($scope, $rootScope, PlanoSelecao) {
    Object.assign(this, {$scope, $rootScope, PlanoSelecao});

    this.isActive = false;

    $scope.list = [];

    for (var key in PlanoSelecao.STATUSES) {
      if (PlanoSelecao.STATUSES.hasOwnProperty(key)) {
        $scope.list.push({
          selected: $scope.plano[key] || false,
          key: key,
          value: PlanoSelecao.STATUSES[key]
        });
      }
    }

    $scope.activate = () => {
      $scope.isActive = !$scope.isActive;
    };

    $scope.update = (item) => {
      if (!$scope.projetoid || !$scope.uid) {
        throw('[dropdown] Os parâmetros projetoid e uid são obrigatórios');
      }

      PlanoSelecao
        .setStatus($scope.projetoid, $scope.uid, item.key, item.selected)
        .then(() => {
          $rootScope.addMensagem('Firula atualizada com sucesso!', 'success', 2);
          $rootScope.$apply();
        })
        .catch(() => {
          $rootScope.addMensagem('Deu pau ao salvar a firula!', 'danger', 4);
          $rootScope.$apply();
        });
    }
  };

  return {
    restrict: 'E',
    controller,
    template: require('./dropdown.html'),
    scope: {projetoid: '=', uid: '=', plano: "="}
  };
}

export default angular.module('directives.dropdown', [])
.directive('dropdown', dropdown)
.name;
