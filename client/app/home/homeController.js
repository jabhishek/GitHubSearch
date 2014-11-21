(function (app) {
    'use strict';
    app.controller('homeController', function() {
        var vm = this;
        vm.user = {
            name: ''
        };
    });
})(angular.module('HousePointsApp'));