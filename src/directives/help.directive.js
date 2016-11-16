import angular from 'angular';
import './help.css'

function help() {
  const controller = function($scope, $rootScope, $location, $sce) {
    Object.assign(this, {$scope, $rootScope, $sce});

    this.$scope.categorias = {
      explicacao: false,
      servico: false,
      industria: false,
      comercio: false
    }

    this.$scope.explicacaoHTML = $sce.trustAsHtml(this.$scope.explicacao);
    this.$scope.servicoHTML = $sce.trustAsHtml(this.$scope.servico);
    this.$scope.industriaHTML = $sce.trustAsHtml(this.$scope.industria);
    this.$scope.comercioHTML = $sce.trustAsHtml(this.$scope.comercio);

    this.$scope.isOpen = () => {
      let val = false;

      for (var key in this.$scope.categorias) {
        if (this.$scope.categorias.hasOwnProperty(key)) {
          if (this.$scope.categorias[key]) val = true;
        }
      }

      return val;
    };

    this.$scope.close = (categoria) => {
      for (var key in this.$scope.categorias) {
        if (this.$scope.categorias.hasOwnProperty(key)) {
          if (categoria != key) {
            this.$scope.categorias[key] = false;
          }
        }
      }
    };

    this.$scope.open = (categoria) => {
      this.$scope.close(categoria);
      this.$scope.categorias[categoria] = !this.$scope.categorias[categoria];
    };

    this.$scope.isTable = (categoria) => {
      return this.$scope[categoria].charAt(0) == '[';
    };
  }

  return {
    restrict: 'E',
    controller,
    template: require('./help.html'),
    scope: {
      explicacao: '@',
      servico: '@',
      industria: '@',
      comercio: '@'
    }
  };
}

export default angular.module('directives.help', [])
.directive('help', help)
.name;
