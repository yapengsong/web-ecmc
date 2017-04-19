'use strict';
angular.module('eayun.api')
    .service('apioverviewService', ['$http', function ($http) {
        var apioverviewService = this;
        apioverviewService.getCusListByOrg = function (_item) {
            return $http.post('/api/ecmc/api/overview/getcuslistbyorg',_item).then(function (response) {
                return response.data;
            });
        };
        apioverviewService.getApiOverviewDetails = function (_item) {
            return $http.post('/api/ecmc/api/overview/getapioverviewdetails',_item).then(function (response) {
                return response.data;
            });
        };
    }]);