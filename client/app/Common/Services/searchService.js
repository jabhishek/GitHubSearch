/**
 * Created by ajain on 21/11/2014.
 */
(function (app) {
    'use strict';
    app.factory('searchService', function ($http, $q) {

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
        obj.searchRepositories = function (name, page) {
            var defer = $q.defer();

            var url = 'https://api.github.com/search/repositories?q=' + name + '&page=' + page;
            $http.get(url).then(function (data) {
                defer.resolve(data);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };
        obj.searchIssues = function (user, name, page, showOpenIssues) {
            page = page || 1;
            var defer = $q.defer();
            var url = 'https://api.github.com/search/issues?q=repo:' +
                user + '/' + name +
                (showOpenIssues ? '+state:open' : '') + '&page=' + page;
            console.log(url);
            $http.get(url).then(function (issues) {
                defer.resolve(issues);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };

        return obj;
    });
})(angular.module('GithubSearch'));