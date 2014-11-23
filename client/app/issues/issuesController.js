(function (app) {
    'use strict';
    app.controller('issuesController', function (searchService, $stateParams, $state) {
        var vm = this;
        console.log($stateParams);

        vm.repository = {
            user: $stateParams.user,
            name: $stateParams.name,
            issues: null,
            totalIssues: null
        };

        var page = parseInt($stateParams.page);
        vm.pagination = {
            currentPage: page
        };
        vm.isLoading = true;
        loadIssues(page);

        vm.goToPreviousPage = function() {
            var previouPage = vm.pagination.currentPage > 1 ? vm.pagination.currentPage - 1 : 1;
            $state.go('issues', {user: $stateParams.user, name: $stateParams.name, page: previouPage});
            vm.pagination.currentPage = previouPage;
        };

        vm.goToNextPage = function() {
            var nextPage = vm.pagination.currentPage < vm.pagination.totalPages ? vm.pagination.currentPage + 1 : vm.pagination.totalPages;
            $state.go('issues', {user: $stateParams.user, name: $stateParams.name, page: nextPage});
            vm.pagination.currentPage = nextPage;
        };

        function loadIssues() {
            searchService.searchIssues(vm.repository.user, vm.repository.name, page).then(function (data) {
                console.log(data);
                vm.repository.issues = data.data.items;
                vm.repository.totalIssues = data.data.total_count;
                vm.pagination.totalPages = Math.ceil(vm.repository.totalIssues / 30);
                vm.isLoading = false;
            }, function (err) {
                vm.isLoading = false;
                vm.repository.issues = null;
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
        }

    });
})(angular.module('GithubSearch'));