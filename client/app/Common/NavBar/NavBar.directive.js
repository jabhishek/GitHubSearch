(function (app) {
    'use strict';
    app.directive('ajNavbar', function () {
        return {
            restrict: 'EA',
            templateUrl: 'Common/NavBar/NavBar.html',
            controller: function() {
                var vm = this;
                vm.isCollapsed = true;
            },
            controllerAs: 'navBarVm'
        };
    });
})(angular.module('HousePointsApp'));