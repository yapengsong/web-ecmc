/**
 * Created by eayun on 2016/4/11.
 */
'use strict'

angular.module('eayun.authority')
    .service('AuthorityService', ['$http', 'SysCode', '$q', function ($http, SysCode, $q) {
        var auth = this;

        auth.add = function (authority) {
            return $http.post('/api/ecmc/system/authority/createauthority', authority || {}).then(function (response) {
                var deferred=$q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject();
                    case  SysCode.success:
                        deferred.resolve(authority);
                    default:
                        deferred.reject();
                }
                return deferred.promise;
            });
        };

        auth.edit = function (authority) {

            delete authority.menuName;
            //var data = {
            //    createTime: authority.createTime,
            //    createBy: authority.createBy,
            //    description: authority.description,
            //    enableFlag: authority.enableFlag,
            //    id: authority.id,
            //    menuId: authority.menuId,
            //    name: authority.name,
            //    permission: authority.permission
            //};

            return $http.post('/api/ecmc/system/authority/modifyauthority', authority || {}).then(function (response) {
                var deferred=$q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject(response.data.message);
                    case  SysCode.success:
                        deferred.resolve(authority);
                    default:
                        deferred.reject();
                }
                return deferred.promise;
            });
        };

        auth.delete = function (authorityId) {
            return $http.post('/api/ecmc/system/authority/deleteauthority', {authorityId: authorityId}).then(function (response) {
                var deferred=$q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject(response.data.message);
                    case  SysCode.success:
                        deferred.resolve(authorityId);
                    default:
                        deferred.reject();
                }
                return deferred.promise;
            });
        };

        auth.getAllEnableAuth = function(){
            return $http.post('/api/ecmc/system/authority/getallenableauth',{}).then(function (response) {
               return response.data.data;
            });
        };

    }]);