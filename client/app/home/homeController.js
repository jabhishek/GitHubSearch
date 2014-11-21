(function (app) {
    'use strict';
    app.controller('homeController', function() {
        var vm = this;
        vm.search = '';

        vm.submitSearch = function(valid, text) {
            if (!valid) {
                return;
            }
            console.log('search');
        }
    });
})(angular.module('GithubSearch'));