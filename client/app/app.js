(function () {
    'use strict';
    angular.module('GithubSearch', ['ui.router', 'ngAnimate', 'LocalStorageModule'])
        .constant('StateErrorCodes', {
            Unauthenticated: 'User not authenticated',
            Unauthorized: 'Unauthorized'
        })
        .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $animateProvider) {
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
        })
        .run(function ($rootScope, StateErrorCodes, $state) {
            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                if (error.next) {
                    $state.transitionTo(error.next);
                }
            });
        });

})();