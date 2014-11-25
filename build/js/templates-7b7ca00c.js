angular.module("GithubSearch").run(["$templateCache",function(s){s.put("home/home.html",'<form id="searchform" name="searchform" novalidate\r\n      ng-submit="homeVm.submitSearch(searchform.$valid, homeVm.repositories.name)">\r\n\r\n    <div class="errors">\r\n        <span class="error-message repName-error" ng-if="searchform.$submitted && searchform.repName.$invalid">Repository name is required.</span>\r\n        <span class="error-message response-error" ng-if="homeVm.error">{{ homeVm.error.message }}</span>\r\n    </div>\r\n    <div class="field">\r\n        <label for="repName">Repository Name:</label>\r\n        <input type="text" name="repName" id="repName" ng-model="homeVm.repositories.name" required/>\r\n    </div>\r\n    <div class="field">\r\n        <input class="button" type="submit" value="Submit"/>\r\n    </div>\r\n</form>\r\n\r\n<div class="loading" ng-if="homeVm.isLoading">\r\n    <span><i class="fa fa-spin fa-refresh"></i>Loading....</span>\r\n</div>\r\n\r\n<div class="pagination">\r\n    <a class="left" ng-href="#" ng-if="homeVm.pagination.currentPage > 1" ng-click="homeVm.goToPreviousPage()"><i\r\n            class="fa fa-chevron-left"></i>Previous</a>\r\n    <a class="right" ng-href="#" ng-if="homeVm.pagination.currentPage < homeVm.pagination.totalPages"\r\n       ng-click="homeVm.goToNextPage()">Next<i class="fa fa-chevron-right"></i></a>\r\n</div>\r\n\r\n<div class="repos">\r\n    <ul class="list">\r\n        <li data-ng-repeat="repo in homeVm.repositories.data" ng-class="issue.state">\r\n            <div class="user">\r\n                <img class="user-image" ng-src="{{::repo.owner.avatar_url}}" alt=""/>\r\n                <span class="name">{{ ::repo.owner.login }}</span>\r\n            </div>\r\n            <div class="url">\r\n                <a ui-sref="repo({user: repo.owner.login, name: repo.name})">{{::repo.full_name}}</a>\r\n            </div>\r\n\r\n            <div class="title">{{ ::repo.description }}</div>\r\n        </li>\r\n    </ul>\r\n</div>'),s.put("issues/issues.html",'<div class="issues">\r\n    <h2>All Issues for {{ ::(issuesVm.repository.user + \'/\' + issuesVm.repository.name) }}</h2>\r\n    <b>{{ issuesVm.repository.totalIssues }}</b> issues found\r\n\r\n    <div class="pagination">\r\n        <a class="left" ng-href="#" ng-if="issuesVm.pagination.currentPage > 1" ng-click="issuesVm.goToPreviousPage()"><i class="fa fa-chevron-left"></i>Previous</a>\r\n        <a class="right" ng-href="#" ng-if="issuesVm.pagination.currentPage < issuesVm.pagination.totalPages" ng-click="issuesVm.goToNextPage()">Next<i class="fa fa-chevron-right"></i></a>\r\n    </div>\r\n\r\n    <label for="openIssuesOnly">Show Open issues Only</label>\r\n    <!--TODO-abhi - Remember preference, so that on next page the filter is applied-->\r\n    <input name="openIssuesOnly" id="openIssuesOnly" type="checkbox" ng-model="issuesVm.showOpenIssuesOnly" ng-change="issuesVm.loadIssues()"/>\r\n\r\n    <ul class="list">\r\n        <li data-ng-repeat="issue in issuesVm.repository.issues" ng-class="issue.state">\r\n            <div class="user">\r\n                <img class="user-image" ng-src="{{issue.user.avatar_url}}" alt=""/>\r\n                <span class="name">{{ ::issue.user.login }}</span>\r\n            </div>\r\n            <div class="title">{{ ::issue.title }}</div>\r\n            <div class="state">{{ ::issue.state }}</div>\r\n        </li>\r\n    </ul>\r\n</div>'),s.put("repo/repo.html",'<h2>All Issues for {{ repoVm.repository.user + \'/\' + repoVm.repository.name }}</h2>\r\n\r\n<div class="loading" ng-if="repoVm.isLoading">\r\n    <span><i class="fa fa-spin fa-refresh"></i>Loading....</span>\r\n</div>\r\n<div class="repository-content" ng-if="repoVm.repository.data">\r\n    <div class="data-field">\r\n        <span class="label">Url:</span>\r\n        <span class="data"><a ng-href="{{repoVm.repository.data.html_url}}"> {{ repoVm.repository.data.html_url }}</a></span>\r\n    </div>\r\n    <div class="data-field">\r\n        <span class="label">Description:</span>\r\n        <span class="data">{{ repoVm.repository.data.description }}</span>\r\n    </div>\r\n    <div class="data-field">\r\n        <span class="label">Forks:</span>\r\n        <span class="data">{{ repoVm.repository.data.forks_count }}</span>\r\n    </div>\r\n    <div class="data-field">\r\n        <span class="label">Stargazers:</span>\r\n        <span class="data">{{ repoVm.repository.data.stargazers_count }}</span>\r\n    </div>\r\n    <div class="data-field">\r\n        <span class="label">Watchers:</span>\r\n        <span class="data">{{ repoVm.repository.data.watchers_count }}</span>\r\n    </div>\r\n\r\n    <a ui-sref="issues({user: repoVm.repository.user, name: repoVm.repository.name, page: 1})"> View All Issues</a>\r\n</div>\r\n\r\n'),s.put("Common/NavBar/NavBar.html",'<header class="navbar flex">\r\n    <div class="container">\r\n        <div class="navbar-header clearfix">\r\n                <h1 class="left"><a ui-sref="home">Github Search</a></h1>\r\n\r\n            <div class="right">\r\n                <span class="nav-toggle" ng-click="navBarVm.isCollapsed = !navBarVm.isCollapsed">\r\n                 <i class="fa fa-lg fa-bars"></i>\r\n            </span>\r\n            </div>\r\n        </div>\r\n        <nav ng-class="{ \'collapsed\': navBarVm.isCollapsed}">\r\n            <ul class="items">\r\n                <li class="home">\r\n                    <a ui-sref="home" ui-sref-active="active" ng-click="navBarVm.isCollapsed = true">Home</a>\r\n                </li>\r\n            </ul>\r\n        </nav>\r\n    </div>\r\n</header>'),s.put("Common/directives/loader/loader.html","<div class=\"loading-container\" min-loader-display=\"300\">\r\n    <div class='loader'>\r\n        <div class='circle loaderBall'></div>\r\n        <div class='circle loaderBall1'></div>\r\n        <div class='circle loaderBall2'></div>\r\n        <div class='circle loaderBall3'></div>\r\n        <div class='circle loaderBall4'></div>\r\n        <div class='circle loaderBall5'></div>\r\n        <div class='circle loaderBall6'></div>\r\n    </div>\r\n</div>")}]);