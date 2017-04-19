/**
 * Created by eayun on 2016/4/25.
 */
'use strict'

angular.module('eayun.cloudhost')
    .service('HostService', ['$http', '$q', 'SysCode', function ($http, $q, SysCode) {
        var vm = this;
        /* 获取数据中心下的项目列表和项目配额信息 */
        vm.getProListByDcId = function (_dcId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/getprolistbydcid', {dcId: _dcId}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 获取所有操作系统列表 */
        vm.getAllVmSysList = function () {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/getallvmsyslist', {}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 项目下校验云主机是否重名 */
        vm.checkVmName = function (_vmModel) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/checkvmname', _vmModel).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 获取项目下的子网列表 */
        vm.getSubNetListByPrjId = function (_prjId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/getsubnetlistbyprjid', {prjId: _prjId}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 获取项目下的云主机类型列表 */
        vm.getModelListByCustomer = function (_cusId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/syssetup/getmodellistbycustomer', {cusId: _cusId}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 获取操作系统类型 */
        vm.getOsList = function () {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/getoslist', {}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 获取在一个操作系统类型下的系统列表 */
        vm.getSysTypeListByOs = function (_osId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/getsystypelistbyos', {osId: _osId}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 获取镜像列表 */
        vm.getImageList = function (_vmModel) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/getimagelist', _vmModel).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 创建云主机 */
        vm.createVm = function (_vmModel) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/createvm', _vmModel).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve();
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 获取云主机详情 */
        vm.getVmById = function (_vmId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/getvmbyid', {vmId: _vmId}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 打开云主机控制台 */
        vm.consoleVm = function (_vmModel) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/consolevm', _vmModel).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 启动云主机 */
        vm.startVm = function (_vmModel) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/startvm', _vmModel).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve();
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 关闭云主机 */
        vm.shutdownVm = function (_vmModel) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/shutdownvm', _vmModel).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve();
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 重启云主机 */
        vm.restartVm = function (_vmModel) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/restartvm', _vmModel).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve();
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 挂起云主机 */
        vm.suspendVm = function (_vmModel) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/suspendvm', _vmModel).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve();
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 恢复云主机 */
        vm.resumeVm = function (_vmModel) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/resumevm', _vmModel).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve();
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 获取当前项目下未挂载的数据盘列表 */
        vm.getUnBindDisk = function (_prjId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/volume/getunbinddisk', {prjId: _prjId}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 获取当前云主机已经挂载的云硬盘数 */
        vm.getDiskCountByVm = function (_vmId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/getdiskcountbyvm', {vmId: _vmId}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 批量挂载云硬盘 */
        vm.bindBatchVolume = function (_volList) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/bindbatchvolume', {volList: _volList}, {$showLoading: true}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject(response.data.message);
                }
            });
            return deferred.promise;
        };
        /* 获取未被绑定的公网IP */
        vm.getUnbindFloatIp = function (_prjId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/floatip/getUnBindFloatIp', {prjId: _prjId}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 绑定公网IP */
        vm.bindFloatIp = function (_floatIp) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/floatip/binDingVm', _floatIp).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 解绑公网IP */
        vm.unBindIpByVmId = function (_vmModel) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/floatip/unBinDingVm', {
                dcId: _vmModel.dcId,
                prjId: _vmModel.prjId,
                floId: _vmModel.floatId,
                floIp: _vmModel.floatIp,
                netId: _vmModel.netId,
                resourceId: _vmModel.vmId,
                resourceType: 'vm'
            }).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve();
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 获取自定义镜像数量 */
        vm.getImageCountByPrjId = function (_prjId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/image/getimagecountbyprjid', {prjId: _prjId}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 创建自定义镜像 */
        vm.createSnapshot = function (_vmModel) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/createsnapshot', _vmModel, {$showLoading: true}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve();
                    case SysCode.error:
                        deferred.reject(response.data.message);
                }
            });
            return deferred.promise;
        };
        /* 镜像重名验证 */
        vm.checkImageName = function (_cloudImage) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/image/checkimagename', _cloudImage).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 升级云主机配置 */
        vm.upgradeVm = function (_vmModel) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/upgradevm', _vmModel).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 获取CPU配置信息列表 */
        vm.getCpuList = function () {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/getcpulist', {}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 获取CPU下的内存配置信息列表 */
        vm.getRamListByCpu = function (_cpuId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/getramlistbycpu', {cpuId: _cpuId}).then(function (response) {
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
            },function(){
                deferred.reject();
            });
            return deferred.promise;
        };
        /* 获取未选择的安全组列表 */
        vm.getSecurityListUnselected = function (_vmId, _prjId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/getsecuritybyprjnovm', {
                vmId: _vmId,
                prjId: _prjId
            }).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 获取已选择的安全组列表 */
        vm.getSecurityListSelected = function (_vmId, _prjId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/getsecuritygroupbyvm', {
                vmId: _vmId,
                prjId: _prjId
            }).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 编辑安全组 */
        vm.editVmSecurityGroup = function (_vmModel) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/editvmsecuritygroup', _vmModel).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve();
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 查询云主机日志 */
        vm.getVmLog = function (_vmModel) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/getvmlog', _vmModel).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 编辑云主机的名称或描述 */
        vm.updateVm = function (_vmModel) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/updatevm', _vmModel).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 获得挂载在当前云主机下的云硬盘列表 */
        vm.getVolumeListByVmId = function (_vmId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/volume/queryvolumesbyvm', {vmId: _vmId}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 解绑云硬盘 */
        vm.unbindVolume = function (_vmId, _volume) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/volume/debindvolume', {
                vmId: _vmId,
                dcId: _volume.dcId,
                prjId: _volume.prjId,
                volId: _volume.volId,
                volName: _volume.volName
            }).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 项目下可绑定云硬盘的云主机列表 */
        vm.getCloudVmToBind = function (_prjId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/getcanbindcloudvmList', {prjId: _prjId}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };

        /* 查询网络下的子网 */
        vm.getSubnetList = function (_data){
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/querySubnetByNet', _data).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };

        /* 校验主机子网的占用情况 */
        vm.changeSubnet = function (_data){
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/checkVmIpUsed', _data).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };

        /* 云主机修改子网 */
        vm.modifySubnet = function(_data){
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/modifysubnet', _data).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };

        /* 云主机状态刷新 */
        vm.refreshVmStatus = function(_data){
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/refreshstatus', _data).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };

        /* 查询云主机 */
        vm.getVm = function(vmId){
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/get', vmId).then(function (response) {
                switch (response.data && response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
    }]);