/**
 * Created by ZHL on 2016/4/6.
 */
'use strict';

angular.module('eayun.cusonline')
    .service('cusonlineService', ['$http', 'SysCode', '$q', function ($http, SysCode, $q) {
        var cusonlineService = this;
        cusonlineService.getOLCusAmount = function () {
            return $http.post('/api/ecmc/syssetup/ol/getolcusamount',{}).then(function (response) {
                return response.data;
            });
        };
        cusonlineService.getNowTime=function(){
            return  $http.post('/api/ecmc/overview/getnowtime',{}).then(function(response) {
                return response.data.data.nowTime;
            });
        };
    }]);