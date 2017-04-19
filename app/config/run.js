'use strict';

angular.module('eayun.ecmc')
    .run(['loginInfo', 'AuthService', '$state', function (loginInfo, AuthService, $state) {
        if (sessionStorage.login) {
            loginInfo.getSessionInfo();
        }
    }])
    .run(['$rootScope', 'loginInfo', '$state', function ($rootScope, loginInfo, $state) {
        $rootScope.hasPermission = function (str) {
            return loginInfo.hasUIPermission(str)
        };
        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                if (!(toState.name == 'login' || sessionStorage.login)) {
                    event.preventDefault();
                    $state.go('login');
                }
            });
    }]);
