/**
 * Created by ZHL on 2016/3/25.
 */
'use strict';

angular.module('eayun.overview')
    .service('OverViewService', ['$http', function ($http) {
        var OverViewService = {};
        OverViewService.getResourceTypeList = function () {
            return $http.post('/api/ecmc/overview/getresourcetypelist', {})
                .then(function (response) {
                    return response.data;
                });
        };
        OverViewService.getDcResourceList = function (resourceType, sortType) {
            return $http.post('/api/ecmc/overview/getdcresourcelist', {
                resourceType: resourceType,
                sortType: sortType
            }).then(function (response) {
                return response.data;
            });
        };
        OverViewService.getYears = function () {
            return $http.post('/api/ecmc/overview/getYears', {})
                .then(function (response) {
                    return response.data;
                });
        };
        OverViewService.getProjectTypeList = function () {
            return $http.post('/api/ecmc/overview/getAllPrjsToCusType', {})
                .then(function (response) {
                    return response.data;
                });
        };
        OverViewService.getMonthsNewCus = function (type) {
            return $http.post('/api/ecmc/overview/getMonthsNewCus', {type:type})
                .then(function (response) {
                    return response.data;
                });
        };
        return OverViewService;
    }]);