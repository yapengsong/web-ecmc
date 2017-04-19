/**
 * Created by eayun on 2016/4/25.
 */
'use strict'

angular.module('eayun.cloudhost')
    .service('VolumeService', ['$http', '$q', 'SysCode', function ($http, $q, SysCode) {
        var volumeService = {};

        /* 获取云硬盘详情 */
        volumeService.getVolumeById = function (volId) {
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


        /* 项目下校验云硬盘是否重名 */
        volumeService.checkVolName = function (volModel) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/volume/getvolumebyname', volModel).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };

        /*创建云硬盘*/
        volumeService.addVolume = function (volModel) {
            return $http.post('/api/ecmc/cloud/volume/addvolume', volModel).then(function (response) {
                return response.data;
            });
        };

        /*删除云硬盘*/
        volumeService.deleteVolume = function (volModel) {
            return $http.post('/api/ecmc/cloud/volume/deletevolume', volModel).then(function (response) {
                return response.data;
            });
        };

        /*挂载云硬盘*/
        volumeService.bindVolume = function (volModel) {
            return $http.post('/api/ecmc/cloud/volume/bindvolume', volModel).then(function (response) {
                return response.data;
            });
        };

        /*解绑云硬盘*/
        volumeService.debindVolume = function (volModel) {
            return $http.post('/api/ecmc/cloud/volume/debindvolume', volModel).then(function (response) {
                return response.data;
            });
        };

        /*创建快照*/
        volumeService.addSnapshot = function (snapModel) {
            return $http.post('/api/ecmc/cloud/snapshot/addsnapshot', snapModel).then(function (response) {
                return response.data;
            });
        };

        /*编辑云硬盘*/
        volumeService.updateVolume = function (volModel) {
            return $http.post('/api/ecmc/cloud/volume/updatevolume', volModel).then(function (response) {
                return response.data;
            });
        };
        // TODO 回滚云硬盘
        volumeService.rollBack = function (_cloudSnapshot) {
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

        // TODO 云硬盘详情页面的删除已经创建的云硬盘快照
        volumeService.deleteSnapshot = function (_cloudSnapshot) {
            var deferred = $q.defer();
            console.log(_cloudSnapshot);
            $http.post('/api/ecmc/cloud/snapshot/deletesnap', _cloudSnapshot).then(function (response) {
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
        //TODO 云硬盘回滚操作的判断（提示语）
        volumeService.getNotice = function (_volume, _cloudSnapshot) {
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
                getVolumeById: volumeService.getVolumeById,
                checkVolName: volumeService.checkVolName,
                addVolume: volumeService.addVolume,
                deleteVolume: volumeService.deleteVolume,
                bindVolume: volumeService.bindVolume,
                debindVolume: volumeService.debindVolume,
                addSnapshot: volumeService.addSnapshot,
                updateVolume: volumeService.updateVolume,
                rollBack: volumeService.rollBack,
                deleteSnapshot: volumeService.deleteSnapshot,
                getNotice: volumeService.getNotice
            };

        }
        ]);