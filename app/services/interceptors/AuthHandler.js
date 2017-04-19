/**
 * Created by ZHL on 2016/4/6.
 */
'use strict';

angular.module('eayun.ecmc').factory('AuthHandler', ['$q', '$injector',
    function ($q, $injector) {
        var AuthHandler = {};
        var count = 0;
        AuthHandler.responseError = function (rejection) {
            var defferred = $q.defer();
            if (rejection.status === 401) {
                var $state = $injector.get('$state');
                var loginInfo = $injector.get('loginInfo');
                loginInfo.logout();
                location.href = "";
            } else if (rejection.status === 403) {
                var eayunModal = $injector.get('eayunModal');
                if (count === 0) {
                    count++
                    eayunModal.error('缺少操作权限，请联系管理员').then(function () {
                        count--;
                    }, function () {
                        count--;
                    });
                }
            }
            defferred.reject(rejection);
            return defferred.promise;
        };
        return AuthHandler;
    }]);