(function () {
    'use strict';
    angular.module('GithubSearch', ['ui.router', 'ngAnimate', 'LocalStorageModule'])
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
                }).state('repo', {
                    url: '/repo/:user/:name',
                    templateUrl: 'repo/repo.html',
                    controller: 'repoController as repoVm'
                });

            $urlRouterProvider.otherwise('/');

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        })
        .run(function ($rootScope, $state) {
            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                if (error.next) {
                    $state.transitionTo(error.next);
                }
            });
        });

})();