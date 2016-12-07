import angular from 'angular';
import './classificacao.css'

function classificacao() {
  const controller = function($scope, $rootScope, PlanoClassificacao) {
    Object.assign(this, {$scope, $rootScope, PlanoClassificacao});

    this.isActive = false;

    $scope.list = [];

    for (var key in PlanoClassificacao.STATUSES) {
      if (PlanoClassificacao.STATUSES.hasOwnProperty(key)) {
        $scope.list.push({
          selected: $scope.plano[key] || false,
          key: key,
          value: PlanoClassificacao.STATUSES[key]
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

      PlanoClassificacao
        .setStatus($scope.projetoid, $scope.uid, item.key, item.selected)
        .then(() => {
          $rootScope.addMensagem('Classificação atualizada com sucesso!', 'success', 2);
          $rootScope.$apply();
        })
        .catch(() => {
          $rootScope.addMensagem('Problemas ao atualizar a classificação do plano!', 'danger', 4);
          $rootScope.$apply();
        });
    }
  };

  return {
    restrict: 'E',
    controller,
    template: require('./classificacao.html'),
    scope: {
      projetoid: '=',
      uid: '=',
      plano: '='
    }
  };
}

export default angular.module('directives.classificacao', [])
.directive('classificacao', classificacao)
.name;
