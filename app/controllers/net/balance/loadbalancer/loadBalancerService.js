/**
 * Created by ZH.F on 2016/4/27.
 */
angular.module('eayun.net')
    .service('LoadBalancerService', ['$http', '$q', 'SysCode', '$state', function ($http, $q, SysCode, $state) {
        var pool = this;
        pool.getProjectListByDcId = function (dcId) {
            return $http.post('/api/ecmc/overview/getprojectlistbydcid', {dcId: dcId});
        };

        pool.getNetListByPrjId = function(_prjId){
            return $http.post('/api/ecmc/virtual/floatip/getNetworkByPrj', {prjId: _prjId});
        };
        pool.getSubNetListByNetId = function(_netId){
            return $http.post('/api/ecmc/virtual/floatip/getSubnetByNetwork',{netId:_netId});
        };

        /**检查是否重名**/
        pool.checkPoolName = function (resourcePool) {
            return $http.post('/api/ecmc/virtual/loadbalance/pool/checkpoolname', {
                prjId: resourcePool.prjId || '',
                poolName: resourcePool.poolName || '',
                poolId:resourcePool.poolId ||''
            });
        };

        pool.addPool = function(model){
            return $http.post('/api/ecmc/virtual/loadbalance/pool/createBalancer',
                model || {}
            ).then(function (response) {
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

        pool.editPool = function(model){
            return $http.post('/api/ecmc/virtual/loadbalance/pool/updateBalancer',
                model || {}
            ).then(function (response) {
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

        pool.getMonitorListByPool = function (_pool) {
            return $http.post('/api/ecmc/virtual/loadbalance/healthmonitor/getMonitorListByPool',{
                poolId: _pool.poolId,
                prjId: _pool.prjId
            });
        };

        pool.bindLbMonitor = function(data) {
            return $http.post('/api/ecmc/virtual/loadbalance/healthmonitor/bindHealthMonitor', data, {$showLoading:true}).then(function (response) {
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
        }

        pool.bindFloatIp = function(data){
            return $http.post('/api/ecmc/virtual/floatip/bindResource', data).then(function (response) {
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

        pool.detachFloatIp = function(_pool){
            var data = {
                dcId:_pool.dcId,
                prjId:_pool.prjId,
                resourceId:_pool.poolId,
                resourceType:'lb',
                floId:_pool.floatId,
                floIp:_pool.floatIp
            };
            return $http.post('/api/ecmc/virtual/floatip/unbundingResource', data).then(function (response) {
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

        pool.getMemeberListBySubnet = function(_subnetId){
            return $http.post('/api/ecmc/virtual/loadbalance/member/getMemeberListBySubnet', {subnetId: _subnetId});
        };

        pool.addMember = function(data){
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/loadbalance/member/addMember',data).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject();
                    case  SysCode.success:
                        deferred.resolve(data);
                    default:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };

        pool.updateMember = function(data){
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/loadbalance/member/updateMember',data).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject();
                    case  SysCode.success:
                        deferred.resolve(data);
                    default:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };


        pool.getPoolById = function(_poolId){
            return $http.post('/api/ecmc/virtual/loadbalance/pool/getLoadBalanceById',{poolId:_poolId});
        };

        pool.getMemberListByPoolId = function(_poolId){
            return $http.post('/api/ecmc/virtual/loadbalance/member/getMemberList', {poolId:_poolId});
        };



    }]);