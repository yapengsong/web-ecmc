/**
 * Created by ZHL on 2016/4/6.
 */
'use strict';

angular.module('eayun.sysdatatree')
    .service('sysdatatreeService', ['$http', function ($http) {
        var sysdatatreeService = this;
        sysdatatreeService.add = function (datatree) {
            return $http.post('/api/ecmc/system/enum/createdatatree',datatree || {},{$showLoading : true}).then(function (response) {
                return response.data;
            });
        };
        sysdatatreeService.edit = function (item) {
            return $http.post('/api/ecmc/system/enum/modifydatatree',item || {},{$showLoading : true}).then(function (response) {
                return response.data;
            });
        };
        sysdatatreeService.getDataTreeChildren = function (parentId) {
            return $http.post('/api/ecmc/system/enum/getdatatreechildren',{'parentId':parentId || '0'},{$showLoading : true}).then(function (response) {
                return response.data;
            });
        };
        sysdatatreeService.doSort = function (ids,sorts) {
            return $http.post('/api/ecmc/system/enum/sortdatatree',{'ids':ids,'sorts':sorts},{$showLoading : true}).then(function (response) {
                return response.data;
            });
        };
        sysdatatreeService.delete = function (ids) {
            return $http.post('/api/ecmc/system/enum/deletedatatree',{'ids':ids},{$showLoading : true}).then(function (response) {
                return response.data;
            });
        };
        sysdatatreeService.getTree = function () {
            return $http.post('/api/ecmc/system/enum/getdatatreenav',{},{$showLoading : true}).then(function (response) {
                return response.data;
            });
        };
        return sysdatatreeService;
    }]);