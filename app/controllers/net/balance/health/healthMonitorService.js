/**
 * Created by ZH.F on 2016/4/18.
 */
'use strict'

angular.module('eayun.net')
    .service('HealthMonitorService', ['$http', '$q', 'SysCode', '$state', function ($http, $q, SysCode, $state) {
        var mnt = this;

        mnt.createHealthMonitor = function (model) {
            return $http.post('/api/ecmc/virtual/loadbalance/healthmonitor/createMonitor', model || {}).then(function (response) {
                var deferred = $q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject();
                    case  SysCode.success:
                        deferred.resolve(response.data.data);
                    default:
                        deferred.reject();
                }
                return deferred.promise;
            });
        };

        mnt.editHealthMonitor = function (model) {
            return $http.post('/api/ecmc/virtual/loadbalance/healthmonitor/updatemonitor', model || {}).then(function (response) {
                var deferred = $q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject();
                    case  SysCode.success:
                        deferred.resolve(model);
                    default:
                        deferred.reject();
                }
                return deferred.promise;
            });
        };

        mnt.checkNameExist = function (_healthMonitor) {
            return $http.post('/api/ecmc/virtual/loadbalance/healthmonitor/checkhealthmonitorname', {
                dcId: _healthMonitor.dcId || '',
                prjId: _healthMonitor.prjId || '',
                ldmName: _healthMonitor.ldmName || '',
                ldmId: _healthMonitor.ldmId || ''
            });
        };

        mnt.deleteHealthMonitor = function(_healthMonitor){
            return $http.post('/api/ecmc/virtual/loadbalance/healthmonitor/deleteHealthMonitor', _healthMonitor || {
            }).then(function (response) {
                var deferred = $q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject();
                    case  SysCode.success:
                        deferred.resolve();
                    default:
                        deferred.reject();
                }
                return deferred.promise;
            });
        };

    }]);