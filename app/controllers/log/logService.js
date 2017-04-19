/**
 * Created by ZHL on 2016/4/6.
 */
'use strict';

angular.module('eayun.log')
    .service('LogService', ['$http', 'SysCode', '$q', function ($http, SysCode, $q) {
        var logService = this;
        logService.getAllProjectList = function () {
            return $http.post('/api/ecmc/overview/getallprojectlist').then(function (response) {
                return response.data;
            });
        };
        logService.getOperLog = function (ecmclog) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/system/log/getOperLogFromMongo', ecmclog).then(function (resp) {
                if (resp.data.respCode == SysCode.success){
                    deferred.resolve(resp.data.data);
                }else{
                    deferred.reject(resp.data.message);
                }
            });
            return deferred.promise;
        };

    }]);