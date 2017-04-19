/**
 * Created by eayun on 2016/4/25.
 */
'use strict'

angular.module('eayun.cloudhost')
    .service('SnapshotService', ['$http', '$q', 'SysCode', function ($http, $q, SysCode) {
        var snapshotService = {};

        /*删除云硬盘快照*/
        snapshotService.deleteSnapshot= function (snapModel) {
            return $http.post('/api/ecmc/cloud/snapshot/deletesnap', snapModel).then(function (response) {
                return response.data;
            });
        };

        /*编辑云硬盘快照*/
        snapshotService.editSnapshot= function (snapModel) {
            return $http.post('/api/ecmc/cloud/snapshot/updatesnapshot', snapModel).then(function (response) {
                return response.data;
            });
        };

        /*创建云硬盘*/
        snapshotService.addVolumeBySnapshot = function (volModel) {
            return $http.post('/api/ecmc/cloud/snapshot/addvolume', volModel).then(function (response) {
                return  response.data;
            });
        };

        /*查询指定云硬盘下快照列表*/
        snapshotService.getSnapshotListByVolId= function (volId) {
            return $http.post('/api/ecmc/cloud/snapshot/getsnaplistbyvolid', {'volId':volId}).then(function (response) {
                return response.data;
            });
        };

        /*验证快照重名*/
        snapshotService.checkSnapshotName= function (snapModel) {
            return $http.post('/api/ecmc/cloud/snapshot/getsnapbyname', snapModel).then(function (response) {
                return response.data;
            });
        };
        // TODO 点击回滚云硬盘按钮的判断
        snapshotService.checkRollBack = function (_cloudSnapshot) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/volume/getvolumebyid', {volId: _cloudSnapshot.volId}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        if(null!=response.data.data.vmId&&''!=response.data.data.vmId&&'null'!=response.data.data.vmId)
                            deferred.reject("云硬盘已挂载，请解绑后操作!");
                        else
                            deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject(response.data.message);
                    default :
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        // TODO 回滚云硬盘
        snapshotService.rollBack = function (_cloudSnapshot) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/snapshot/rollbackvolume', _cloudSnapshot).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve();
                    case SysCode.error:
                        deferred.reject(response.data.message);
                    default :
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 获取云硬盘详情 */
        snapshotService.getVolumeById = function (volId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/volume/getvolumebyid', {volId: volId}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        //TODO 云硬盘回滚操作的判断（提示语）
        snapshotService.getNotice = function (_volume, _cloudSnapshot) {
            if (_volume.isDeleted == '1' || _volume.isDeleted == '2') {
                return "源硬盘已删除，无法回滚";
            } else if (_volume.chargeState == '1') {
                return "云硬盘" + _volume.volName + "已欠费，请充值后操作";

            } else if (_volume.chargeState == '2' || _volume.chargeState == '3') {
                return "云硬盘" + _volume.volName + "已到期，请续费后操作";

            } else if (_volume.volSize != _cloudSnapshot.snapSize) {
                return "云硬盘已扩容，无法回滚";

            } else if (null != _volume.vmId && '' != _volume.vmId && 'null' != _volume.vmId) {
                return "云硬盘已挂载，请解绑后操作!";

            } else if (_volume.volStatus != 'AVAILABLE' && _volume.volStatus != 'IN-USE') {
                if (_volume.volStatus == 'DELETING') {
                    return "源硬盘" + _volume.statusForDis + "，无法回滚";
                } else if (_volume.volStatus == 'ERROR') {
                    return "源硬盘" + _volume.statusForDis + "，无法回滚";
                }else if(_volume.volStatus == 'BACKING-UP'){
                    return "云硬盘快照创建中，请稍候";
                } else {
                    return "源硬盘" + _volume.statusForDis + "，请稍后再试";
                }
            }
        };
        return {
            deleteSnapshot:snapshotService.deleteSnapshot,
            editSnapshot:snapshotService.editSnapshot,
            addVolumeBySnapshot:snapshotService.addVolumeBySnapshot,
            getSnapshotListByVolId:snapshotService.getSnapshotListByVolId,
            checkSnapshotName:snapshotService.checkSnapshotName,
            rollBack:snapshotService.rollBack,
            getVolumeById: snapshotService.getVolumeById,
            getNotice: snapshotService.getNotice
        };

    }]);