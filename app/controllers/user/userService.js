/**
 * Created by eayun on 2016/4/9.
 */
'user strict'

angular.module('eayun.user')
    .service('UserService', ['$http', 'SysCode', '$q', function ($http, SysCode, $q) {
        var userService = this;

        userService.add = function (user) {
            return $http.post('/api/ecmc/system/user/createuser', user || {}).then(function (response) {
                var deferred=$q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject(response.data.message);
                    case  SysCode.success:
                        deferred.resolve(user);
                    default:
                        deferred.reject();
                }
                return deferred.promise;
            });
        };

        userService.edit = function (user) {
            return $http.post('/api/ecmc/system/user/modifyuser', user || {}).then(function (response) {
                var deferred=$q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject(response.data.message);
                    case  SysCode.success:
                        deferred.resolve(user);
                    default:
                        deferred.reject();
                }
                return deferred.promise;
            });
        };
        userService.validName= function (account,id) {
            return $http.post('/api/ecmc/system/user/checkaccount',{account:account,id:id}).then(function (response) {
                if(response.data.respCode==SysCode.success){
                    return true;
                }else{
                    return false;
                }
            });
        };
        userService.delete = function (userId) {
            return $http.post('/api/ecmc/system/user/deleteuser', {userId: userId}).then(function (response) {
                var deferred=$q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject(response.data.message);
                    case  SysCode.success:
                        deferred.resolve();
                    default:
                        deferred.reject();
                }
                return deferred.promise;
            });
        };

    }]);