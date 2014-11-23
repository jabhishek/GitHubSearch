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
                });

            $urlRouterProvider.otherwise('/home');

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
            searchService.searchByRepository(repository).then(function (data) {
                console.log('resolved');
                console.log(data);
                vm.data = data.data.items[0];
                vm.isLoading = false;
            }, function (err) {
                vm.isLoading = false;
                vm.data = null;
                console.log('rejected');
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
        obj.searchByRepository = function (repository) {
            var defer = $q.defer();
            if (searchResult && searchResult.repositoryName === repository.user + '/' + repository.name) {
                console.log('get from cache');
                defer.resolve(searchResult.data);
            } else {
                var url = 'https://api.github.com/search/repositories?q=repo:' + repository.user + '/' + repository.name;
                $http.get(url).then(function (data) {
                    searchResult = {
                        repositoryName: repository.user + '/' + repository.name,
                        data: data
                    };
                    defer.resolve(data);
                }, function (err) {
                    searchResult = null;
                    console.log('error');
                    defer.reject(err);
                });
            }
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