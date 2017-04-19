/**
 * Created by zhouhaitao on 2016/8/26.
 */
'use strict'

angular.module('eayun.recycle')
    .service('RecycleService', ['$http', '$q', 'SysCode', function ($http, $q, SysCode) {
        var vm = this;

        /* 获取云主机详情 */
        vm.getVmById = function (_vmId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/getRecycleVmById', _vmId).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };

        /* 删除云主机 */
        vm.deleteVm = function (_vmModel) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/deletevm', _vmModel).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve();
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 删除云硬盘 */
        vm.deleteVol = function (_volModel) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/volume/deletevolume', _volModel).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 删除云硬盘快照 */
        vm.deleteSnap = function (_snapModel) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/snapshot/deletesnap', _snapModel).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /*获取云硬盘详情*/
        vm.getVolumeById = function (_volId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/volume/getvolumebyid', {volId: _volId}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
    }]);