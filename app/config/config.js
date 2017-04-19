'use strict';

angular.module('eayun.ecmc')
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.headers.common.Accept = 'text/plain,application/json, */*';
    }])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('LoadingHandler');
        $httpProvider.interceptors.push('ApiHandler');
        $httpProvider.interceptors.push('AuthHandler');
        $httpProvider.interceptors.push('CodeHandler');
    }]);
