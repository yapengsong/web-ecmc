/**
 * Created by ZH.F on 2016/4/20.
 */
'use strict'

angular.module('eayun.net')
    .service('VipService', ['$http', '$q', 'SysCode', '$state', function ($http, $q, SysCode, $state) {
        var vip = this;

        vip.createVip = function (model) {
            return $http.post('/api/ecmc/virtual/loadbalance/vip/createvip', model || {}).then(function (response) {
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

        vip.editVip = function (model) {
            return $http.post('/api/ecmc/virtual/loadbalance/vip/updatevip', model || {}).then(function (response) {
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

        vip.checkNameExist = function (_vip) {
            return $http.post('/api/ecmc/virtual/loadbalance/vip/checkvipname', {
                datacenterId: _vip.dcId || '',
                projectId: _vip.prjId || '',
                uname: _vip.vipName || '',
                id: _vip.vipId || ''
            });
        };

        vip.deleteVip = function (_vip) {
            return $http.post('/api/ecmc/virtual/loadbalance/vip/deletevip', {
                id: _vip.vipId,
                projectId: _vip.prjId,
                datacenterId: _vip.dcId
            }).then(function (response) {
                var deferred = $q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject(response);
                    case  SysCode.success:
                        deferred.resolve();
                    default:
                        deferred.reject();
                }
                return deferred.promise;
            });
        };

        vip.getSubNetListByPrjId = function (_dcId, _prjId) {
            if (_dcId && _prjId) {
                return $http.post('/api/ecmc/virtual/subnetwork/getsubnetlistbyprjid', {
                    dcId: _dcId,
                    prjId: _prjId
                }).then(function (resp) {
                    return resp.data;
                });
            } else {
                return [];
            }
        };

        vip.getPoolListByPrjId = function (_dcId, _prjId) {
            if (_dcId && _prjId) {
                return $http.post('/api/ecmc/virtual/loadbalance/pool/getpoollistbyprjid', {
                    dcId: _dcId,
                    prjId: _prjId
                }).then(function (resp) {
                    return resp.data;
                });
            } else {
                return [];
            }
        };

        vip.isDeletable = function (_vip) {
            return $http.post('/api/ecmc/virtual/loadbalance/vip/checkfordel', {poolId: _vip.poolId}).then(function (resp) {
                return resp.data;
            });
        };

    }]);