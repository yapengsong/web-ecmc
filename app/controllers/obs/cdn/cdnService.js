'use strict';

angular.module('eayun.obs')
    .service('cdnService', ['$http', function ($http) {
        var cdnService = this;
        cdnService.getAllDomainList = function (cusId) {
            return $http.post('/api/ecmc/obs/cdn/getalldomainlist',{'cusId':cusId}).then(function (response) {
                return response.data;
            });
        };
        cdnService.getDomainData = function (_item) {
            return $http.post('/api/ecmc/obs/cdn/getdomaindata',_item).then(function (response) {
                return response.data;
            });
        };
        cdnService.getMonthDomainData = function (cusId) {
            return $http.post('/api/ecmc/obs/cdn/getmonthdomaindata',{'cusId':cusId}).then(function (response) {
                return response.data;
            });
        };
    }]);