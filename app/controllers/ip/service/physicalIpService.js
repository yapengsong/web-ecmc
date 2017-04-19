/**
 * Created by cxy on 2016/3/25.
 */
'use strict';

angular.module('eayun.ip')
    .service('IpPhysicalService', ['$http', function ($http) {
        var physicalIpService = {};

        physicalIpService.getDcList= function () {
            return $http.post('/api/ecmc/physical/datacenter/getlistdatacenter',{}).then(function (response) {
                return response.data.data;
            });
        };
        physicalIpService.getIp= function (id) {
            return $http.post('/api/ecmc/virtual/cloudoutip/getOutip',{id:id}).then(function (response) {
                return response.data.data;
            });
        };
        return physicalIpService;
    }])

