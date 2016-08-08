import angular from 'angular';

function navigation() {
    const navigationController = function($scope, $rootScope, $location) {
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

        Object.assign(this, {$rootScope});

    }
    return {
        restrict: 'E',
        controller: navigationController,
        template: require('./navigation.html')
    };
}

export default angular.module('directives.navigation', [])
.directive('navigation', navigation)
.name;
