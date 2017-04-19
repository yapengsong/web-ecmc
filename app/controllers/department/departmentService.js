/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.department')
    .service('DepartmentService', ['$http', '$q', 'SysCode', function ($http, $q, SysCode) {
        var department = this;

        department.getTree = function () {
            return $http.post('/api/ecmc/system/depart/getdeparttreegrid', {}).then(function (res) {
                return res.data.data;
            });
        };
        department.getDepartment = function (id) {
            return $http.post('/api/ecmc/system/depart/getdepartbyid', {id:id}).then(function (res) {
                return res.data.data;
            });
        };
        department.add = function (model) {
            return $http.post('/api/ecmc/system/depart/createdepart', model || {}).then(function (response) {
                var deferred=$q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject(response.data.message);
                    case  SysCode.success:
                        deferred.resolve(model);
                    default:
                        deferred.reject();
                }
                return deferred.promise;
            });
        };

        department.edit = function (model) {
            return $http.post('/api/ecmc/system/depart/modifydepart', model || {}).then(function (response) {
                var deferred=$q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject(response.data.message);
                    case  SysCode.success:
                        deferred.resolve(model);
                    default:
                        deferred.reject();
                }
                return deferred.promise;
            });
        };

        department.delete = function(departmentId){
            return $http.post('/api/ecmc/system/depart/deldepart', {departmentId:departmentId}).then(function (response) {
                var deferred=$q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject(response.data.message);
                    case  SysCode.success:
                        deferred.resolve(departmentId);
                    default:
                        deferred.reject();
                }
                return deferred.promise;
            });
        };
        //验证部门编号
        department.checkDepartCode = function(code, id){
            return $http.post('/api/ecmc/system/depart/checkdepartcode', {code:code, id:id}).then(function(response){
                return !response.data.data;
            });
        }
    }]);