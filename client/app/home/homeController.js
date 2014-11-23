(function (app) {
    'use strict';
    app.controller('homeController', function (searchService) {
        var vm = this;
        vm.isLoading = false;
        vm.repository = {
            user: 'angular',
            name: 'angular'
        };

        vm.data = undefined;

        vm.submitSearch = function (valid, repository) {
            vm.error = null;
            if (!valid) {
                return;
            }
            vm.isLoading = true;
            searchService.searchRepository(repository.user, repository.name).then(function (data) {
                vm.data = data.data.items[0];
                vm.isLoading = false;
            }, function (err) {
                vm.isLoading = false;
                vm.data = null;
                if (err.status === 422) {
                    vm.error = {
                        message: 'Repository not found.'
                    }
                } else {
                    vm.error = {
                        message: err.statusText
                    }
                }

            });
            console.log('search');
        }
    });
})(angular.module('GithubSearch'));