(function (app) {
    'use strict';
    app.controller('repoController', function (searchService, $stateParams, $state) {
        var vm = this;
        vm.repository = {
            user: $stateParams.user,
            name: $stateParams.name,
            data: null
        };

        vm.isLoading = true;
        searchService.searchRepository(vm.repository.user, vm.repository.name).then(function (data) {
            vm.repository.data = data.data.items[0];
            vm.isLoading = false;
        }, function (err) {
            vm.isLoading = false;
            vm.repository.data = null;
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
    });
})(angular.module('GithubSearch'));