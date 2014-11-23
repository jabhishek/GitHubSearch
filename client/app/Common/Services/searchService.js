/**
 * Created by ajain on 21/11/2014.
 */
(function (app) {
    "use strict";
    app.factory('searchService', function ($http, $q) {

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
    });
})(angular.module('GithubSearch'));