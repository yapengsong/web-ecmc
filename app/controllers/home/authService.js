/**
 * Created by ZHL on 2016/4/12.
 */
'use strict';

angular.module('eayun.ecmc')
    .factory('loginInfo', ['$http', '$q', '$cookies', function ($http, $q, $cookies) {
        var loginInfo = {};
        var session;
        var UIPerMap = {};
        //var HttpPerMap = {};
        var setSession = function (_session) {
            session = _session;
            initUIPerMap();
        };
        var initUIPerMap = function () {
            if (session && angular.isArray(session.uiPermissions) && session.uiPermissions.length > 0) {
                var uiPermissions = session.uiPermissions;
                angular.forEach(uiPermissions, function (value) {
                    UIPerMap[value.replace('ui:', '')] = true;
                });
            }
        };

        loginInfo.login = function () {
            sessionStorage.login = true;
            loginInfo.getSessionInfo();
        };
        loginInfo.logout = function () {
            delete sessionStorage.login;
            session = undefined;
            UIPerMap = {};
            $cookies.remove('JSESSIONID');
        };
        loginInfo.getSessionInfo = function () {
            var deferred = $q.defer();
            if (session) {
                deferred.resolve(angular.copy(session, {}));
            } else {
                $http.post('/api/ecmc/system/user/getsessioninfo', {}).then(function (resp) {
                    setSession(resp.data.data);
                    deferred.resolve(angular.copy(session, {}));
                });
            }
            return deferred.promise;
        };
        loginInfo.hasUIPermission = function (str) {
            return !!UIPerMap[str];
        }
        return loginInfo;
    }])
    .service('AuthService', ['$http', '$q', 'SysCode', 'loginInfo','$state',
        function ($http, $q, SysCode, loginInfo,$state) {
            var auth = this;
            auth.login = function (userName, passWord, captcha) {
                var deferred = $q.defer();

                auth.getKey().then(function (key) {
                    $http.post('/api/ecmc/system/user/login', {
                            codenum: captcha,
                            userName: userName,
                            userPasswd: strEnc(passWord, key, '', '')
                        }, {$showLoading: true})
                        .then(function (response) {
                            switch (response.data.respCode) {
                                case SysCode.error:
                                    deferred.reject(response.data.message);
                                    break;
                                case  SysCode.success:
                                    loginInfo.login();
                                    deferred.resolve();
                                    break;
                                default:
                                    deferred.reject();
                                    break;
                            }
                        });
                });

                return deferred.promise;
            };
            auth.logout = function () {
                var deferred = $q.defer();
                loginInfo.logout();
                $state.go('login');
                $http.post('/api/ecmc/system/user/logout', {}, {$showLoading: true}).then(function (response) {
                    switch (response.data.respCode) {
                        case SysCode.error:
                            deferred.reject(response.data.message);
                            break;
                        case  SysCode.success:
                            deferred.resolve();
                            break;
                        default:
                            deferred.reject();
                            break;
                    }
                }, function () {
                    deferred.reject();
                });
                return deferred.promise;
            };
            auth.getKey = function () {
                return $http.post('/api/ecmc/system/user/getpasskey', {}, {$showLoading: true}).then(function (resp) {
                    return resp.data;
                });
            };
            auth.password = function (oldValue, newValue) {
                var deferred = $q.defer();
                auth.getKey().then(function (key) {
                    $http.post('/api/ecmc/system/user/changepass', {
                            origPwd: strEnc(oldValue, key, '', ''),
                            newPwd: strEnc(newValue, key, '', '')
                        }, {$showLoading: true})
                        .then(function (response) {
                            switch (response.data.respCode) {
                                case SysCode.error:
                                    deferred.reject(response.data.message);
                                    break;
                                case  SysCode.success:
                                    deferred.resolve();
                                    break;
                                default:
                                    deferred.reject();
                                    break;
                            }
                        });
                });
                return deferred.promise;
            };
        }])
    .service('HomeCommonService', ['$http', '$q', 'SysCode', function ($http, $q, SysCode) {
        var common = this;
        common.getAllPrjName = function () {
            return common.getAllProject().then(function (data) {
                var array = [];
                angular.forEach(data, function (value) {
                    array.push(value.prjName);
                });
                return array;
            });
        };
        common.getAllCusOrgName = function () {
            return $http.post('/api/ecmc/overview/getallcustomerlist', {}).then(function (response) {
                var array = [];
                angular.forEach(response.data, function (value) {
                    array.push(value.cusOrg);
                });
                return array;
            });
        };
        common.getAllProject = function () {
            return $http.post('/api/ecmc/overview/getallprojectlist', {})
                .then(function (response) {
                    return response.data;
                });
        };
        common.getPrjByDcId = function (_dcId) {
            if (_dcId) {
                return $http.post('/api/ecmc/overview/getprojectlistbydcid', {dcId: _dcId}).then(function (resp) {
                    return resp.data;
                });
            } else {
                return [];
            }
        };
        common.getDcList = function () {
            return $http.post('/api/ecmc/overview/getalldclist', {}).then(function (resp) {
                return resp.data;
            });
        };
        common.getPrjQuotaById = function (prjId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/project/getprojectpool', {projectId: prjId}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject(response.data.message);
                        break;
                    case  SysCode.success:
                        deferred.resolve(response.data.data);
                        break;
                    default:
                        deferred.reject();
                        break;
                }
            });
            return deferred.promise;
        };
        common.getFullTime=function(){
           return  $http.post('/api/ecmc/overview/getnowtime',{}).then(function(response) {
               return response.data.data.nowTime;
           });
        };
        common.getOsTypeList = function () {
            return $http.post('/api/ecmc/cloud/image/getostypelist', {}).then(function (resp) {
                return resp.data;
            });
        };
        common.getMarketTypeList = function () {
            return $http.post('/api/ecmc/cloud/image/getmarkettypelist', {}).then(function (resp) {
                return resp.data;
            });
        };
    }]);