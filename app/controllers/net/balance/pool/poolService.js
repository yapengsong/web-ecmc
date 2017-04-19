/**
 * Created by dell on 2016/4/17.
 */
angular.module('eayun.net')
    .service('NetPoolService', ['$http', '$q', 'SysCode', '$state', function ($http,$q, SysCode, $state) {
        var pool = this;

        pool.getDcResourceList = function () {
            return $http.post('/api/ecmc/overview/getalldclist');
        };
        pool.getProjectListByDcId = function (dcId) {
            return $http.post('/api/ecmc/overview/getprojectlistbydcid', {dcId: dcId});
        };
        pool.getSubNetListByPrjId = function(resourcePool){

            return $http.post('/api/ecmc/virtual/subnetwork/getsubnetlistbyprjid',{dcId:resourcePool.dcId,prjId:resourcePool.prjId});
        };
        /**检查是否重名**/
        pool.checkPoolName = function (resourcePool) {
            return $http.post('/api/ecmc/virtual/loadbalance/pool/checkpoolname', {
                prjId: resourcePool.prjId || '',
                poolName: resourcePool.poolName || '',
                poolId:resourcePool.poolId ||''
            });
        };



        pool.addPool = function (model) {
            return $http.post('/api/ecmc/virtual/loadbalance/pool/createpool', model || {}).then(function (response) {
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

        pool.editPool = function (model) {
            return $http.post('/api/ecmc/virtual/loadbalance/pool/updatepool', model || {}).then(function (response) {
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
        /**查询未绑定的浮动IP**/
        pool.getUnBindFloatIp = function(prjId){
            return $http.post('/api/ecmc/virtual/floatip/getUnBindFloatIp',{prjId: prjId});
        };

        /**绑定公网Ip**/
        pool.bindFloatIp = function (model) {
            return $http.post('/api/ecmc/virtual/loadbalance/pool/bindfloatip', {poolId:model.poolId,floatId:model.floId,vipId:model.vipId}).then(function (response) {
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
        /**解绑浮动ip**/
        pool.detachFloatIp = function(pool){
            return $http.post('/api/ecmc/virtual/loadbalance/pool/unbindfloatip', {poolId:pool.poolId, floatId:pool.floatId}).then(function (response) {
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
        /**查询未绑定的健康检查**/
        pool.getUnBindLbMonitor = function(pool){
            return $http.post('/api/ecmc/virtual/loadbalance/healthmonitor/bindmonitorlist',{prjId:pool.prjId,poolId:pool.poolId});
        };

        /**绑定健康检查**/
        pool.bindLbMonitor = function (model) {

            return $http.post('/api/ecmc/virtual/loadbalance/pool/bindhealthmonitor',{poolId:model.poolId,healthMonitorId:model.ldmId}).then(function (response) {
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


        /**查询已绑定的健康检查**/
        pool.getHaveBindLbMonitor = function(pool){
            return $http.post('/api/ecmc/virtual/loadbalance/healthmonitor/poolmonitorlist',{datacenterId : pool.dcId,projectId:pool.prjId ,poolId:pool.poolId});
        };

        /**解绑健康检查**/
        pool.detechLbMonitor = function(pool){
            return $http.post('/api/ecmc/virtual/loadbalance/healthmonitor/detachHealthMonitor', {datacenterId:pool.dcId,projectId:pool.prjId,poolId:pool.poolId,monitorId:pool.ldmId}).then(function (response) {
                var deferred = $q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject();
                    case  SysCode.success:
                        deferred.resolve(pool);
                    default:
                        deferred.reject();
                }
                return deferred.promise;
            });
        };
        /**删除资源池**/
        pool.deletePool = function(pool){
            return $http.post('/api/ecmc/virtual/loadbalance/pool/deletepool', {poolId:pool.poolId}).then(function (response) {
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