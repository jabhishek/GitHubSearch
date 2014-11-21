(function () {
    'use strict';
    angular.module('GithubSearch', ['ui.router', 'ngCookies', 'restangular', 'ngAnimate', 'LocalStorageModule'])
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