/**
 * Created by eayun on 2016/4/9.
 */
'use strict'

angular.module('eayun.role')
    .service('RoleService', ['$http', '$q', 'SysCode', function ($http, $q, SysCode) {
        var roleService = this;

        roleService.queryAll = function () {
            return $http.post('/api/ecmc/system/role/findrolelist', {}).then(function (response) {
                return response.data.data;
            });
        };

        roleService.querySelectList = function(){
            return $http.post('/api/ecmc/system/role/findroleselectlist', {}).then(function(response){
                return response.data.data;
            });
        };

        roleService.add = function (role) {
            return $http.post('/api/ecmc/system/role/createrole', role || {}).then(function (response) {
                var deferred=$q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject(response.data.message);
                    case  SysCode.success:
                        deferred.resolve(role);
                    default:
                        deferred.reject();
                }
                return deferred.promise;
            });
        };
        roleService.edit = function (role) {
            return $http.post('/api/ecmc/system/role/modifyrole', role || {}).then(function (response) {
                var deferred=$q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject(response.data.message);
                    case  SysCode.success:
                        deferred.resolve(role);
                    default:
                        deferred.reject();
                }
                return deferred.promise;
            });
        };
        roleService.setAuthority= function (roleId,menusIds,authIds) {
            return $http.post('/api/ecmc/system/role/saveroleauth',{roleId:roleId,menus:menusIds,authorities:authIds}).then(function (response) {
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
        roleService.delete = function (roleId) {
            return $http.post('/api/ecmc/system/role/deleterole', {roleId: roleId}).then(function (response) {
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
        roleService.validName= function (roleName,roleId) {
            console.log("service valid");
            return $http.post('/api/ecmc/system/role/checkrolename',{name:roleName,id:roleId}).then(function (response) {
                // false 表示不重复
                if(response.data.respCode==SysCode.success && response.data.data == false){
                    return true;
                }else{
                    return false;
                }
            });
        };
        roleService.getMenuAuthByRoleId= function (roleId) {
          return $http.post('/api/ecmc/system/role/getroledetail',{roleId:roleId}).then(function (response) {
                return response.data.data;
          });
        };
        roleService.getAuthByMenuId= function (menuId) {
            return $http.post('/api/ecmc/system/authority/findauthoritylist',{menuId:menuId}).then(function (response) {
                return response.data;
            });
        };
    }]);