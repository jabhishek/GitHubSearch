(function (app) {
    'use strict';
    app.controller('homeController', function (searchService) {
        var vm = this;
        vm.isLoading = false;
        vm.repositories = {
            name: 'angular',
            data: null,
            count: null
        };

        vm.pagination = {
            currentPage: 1
        };

        vm.goToPreviousPage = function() {
            var previouPage = vm.pagination.currentPage > 1 ? vm.pagination.currentPage - 1 : 1;
            loadRepos(vm.repositories.name, previouPage);
            vm.pagination.currentPage = previouPage;
        };

        vm.goToNextPage = function() {
            var nextPage = vm.pagination.currentPage < vm.pagination.totalPages ? vm.pagination.currentPage + 1 : vm.pagination.totalPages;
            loadRepos(vm.repositories.name, nextPage);
            vm.pagination.currentPage = nextPage;
        };

        vm.submitSearch = function (valid, name) {
            vm.error = null;
            if (!valid) {
                return;
            }
            loadRepos(name, 1);
            console.log('search');
        };

        function loadRepos(name, page) {
            vm.isLoading = true;
            searchService.searchRepositories(name, page).then(function (data) {
                console.log(data);
                vm.repositories.data = data.data.items;
                vm.repositories.count = data.data.total_count;
                vm.pagination.totalPages = Math.ceil(vm.repositories.count / 30);
                vm.isLoading = false;
            }, function (err) {
                vm.isLoading = false;
                vm.repositories.data = null;
                if (err.status === 422) {
                    vm.error = {
                        message: 'Repository not found.'
                    };
                } else {
                    vm.error = {
                        message: err.statusText
                    };
                }

            });
        }
    });
})(angular.module('GithubSearch'));