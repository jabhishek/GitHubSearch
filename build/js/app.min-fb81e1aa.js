(function () {
    'use strict';
    angular.module('GithubSearch', ['ui.router', 'ngAnimate', 'LocalStorageModule'])
        .constant('StateErrorCodes', {
            Unauthenticated: 'User not authenticated',
            Unauthorized: 'Unauthorized'
        })
        .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider", "$animateProvider", function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $animateProvider) {
            $animateProvider.classNameFilter(/animate/);
            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'home/home.html',
                    controller: 'homeController as homeVm'
                }).state('issues', {
                    url: '/issues/:user/:name/:page',
                    templateUrl: 'issues/issues.html',
                    controller: 'issuesController as issuesVm'
                });

            $urlRouterProvider.otherwise('/');

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        }])
        .run(["$rootScope", "StateErrorCodes", "$state", function ($rootScope, StateErrorCodes, $state) {
            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                if (error.next) {
                    $state.transitionTo(error.next);
                }
            });
        }]);

})();
(function (app) {
    'use strict';
    app.controller('homeController', ["searchService", function (searchService) {
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
    }]);
})(angular.module('GithubSearch'));
(function (app) {
    'use strict';
    app.controller('issuesController', ["searchService", "$stateParams", "$state", function (searchService, $stateParams, $state) {
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

    }]);
})(angular.module('GithubSearch'));
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
})(angular.module('GithubSearch'));
/**
 * Created by ajain on 21/11/2014.
 */
(function (app) {
    "use strict";
    app.factory('searchService', ["$http", "$q", function ($http, $q) {

        var obj = {};
        var searchResult = {};
        obj.searchRepository = function (user, name) {
            var defer = $q.defer();
            if (searchResult && searchResult.repositoryName === user + '/' + name) {
                console.log('get from cache');
                defer.resolve(searchResult.data);
            } else {
                var url = 'https://api.github.com/search/repositories?q=repo:' + user + '/' + name;
                $http.get(url).then(function (data) {
                    searchResult = {
                        repositoryName: user + '/' + name,
                        data: data
                    };
                    defer.resolve(data);
                }, function (err) {
                    searchResult = null;
                    defer.reject(err);
                });
            }
            return defer.promise;
        };
        obj.searchIssues = function (user, name, page) {
            page = page || 1;
            var defer = $q.defer();
            var url = 'https://api.github.com/search/issues?q=repo:' + user + '/' + name + '&page=' + page;
            $http.get(url).then(function (issues) {
                defer.resolve(issues);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };

        return obj;
    }]);
})(angular.module('GithubSearch'));
(function (app) {
    'use strict';
    app.directive('loader', ["$rootScope", "$timeout", function ($rootScope, $timeout) {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'Common/directives/loader/loader.html',
            link: function (scope, elem, attrs) {
                var hideLoaderTimeout;
                var minLoaderDisplayTime = attrs.minLoaderDisplay || 300;
                scope.data = {
                    startTime: undefined
                };

                var unregisterStart = $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
                    scope.data.startTime = new Date();
                    elem.removeClass('ng-hide');
                });

                var unregisterSuccess = $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
                    var transitionTime = new Date() - scope.data.startTime;

                    var loaderTimeout = minLoaderDisplayTime - transitionTime;
                    loaderTimeout = loaderTimeout > 0 ? loaderTimeout : 0;
                    hideLoaderTimeout = $timeout(function () {
                        elem.addClass('ng-hide');
                    }, loaderTimeout);
                });

                var unregisterError = $rootScope.$on('$stateChangeError', function () {
                    elem.addClass('ng-hide');
                });

                scope.$on('destroy', function () {
                    unregisterStart();
                    unregisterSuccess();
                    unregisterError();
                    $timeout.cancel(hideLoaderTimeout);
                });
            }
        };
    }]);
})(angular.module('GithubSearch'));