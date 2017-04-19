/**
 * Created by eayun on 2016/4/25.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('CloudhostHostDetailCtrl', ['$state', '$stateParams', 'HostService', 'eayunModal', 'toast', '$timeout', 'VolumeService', '$scope', 'SysCode', 'WarningService', 'warningMsg',
        function ($state, $stateParams, HostService, eayunModal, toast, $timeout, VolumeService, $scope, SysCode, WarningService, warningMsg) {
            var vm = this;

            vm.vmNameEditable = false;
            vm.vmModel = {};
            vm.volumeList = [];
            vm.vmStatusClass = '';
            vm.volStatusClass = [];
            var projectInfo = {};
            /*更新云主机详情状态标识颜色*/
            var getVmStatusClass = function () {
                if(vm.vmModel.chargeState != '0'){
                    vm.vmStatusClass = 'gray';
                }
                else if (vm.vmModel.vmStatus && vm.vmModel.vmStatus == 'ACTIVE') {
                    vm.vmStatusClass = 'green';
                }
                else if (vm.vmModel.vmStatus == 'SHUTOFF' ) {
                    vm.vmStatusClass = 'gray';
                }
                else if (vm.vmModel.vmStatus == 'ERROR'|| vm.vmModel.vmStatus == 'SUSPENDED') {
                    vm.vmStatusClass = 'red';
                }
                else {
                    vm.vmStatusClass = 'yellow';
                }
            };
            /*更新云硬盘状态标识颜色*/
            /*vm.getVolumeStatus = function (_volume, _index) {
             vm.volStatusClass[_index] = '';
             if (_volume.volStatus && _volume.volStatus == 'AVAILABLE' || _volume.volStatus == 'IN-USE') {
             return 'green';
             }
             else if (_volume.volStatus == 'ERROR') {
             return 'gray';
             }
             else if (_volume.volStatus == 'CREATING' || _volume.volStatus == 'DOWNLOADING' || _volume.volStatus == 'ATTACHING' || _volume.volStatus == 'DETACHING') {
             return 'yellow';
             }
             };*/
            /*获得挂载在当前云主机下的云硬盘列表*/
            var getVolumeList = function () {
                HostService.getVolumeListByVmId($stateParams.vmId).then(function (data) {
                    vm.volumeList = data;
                });
            };
            /*刷新云主机*/
            var refreshVmInfo = function () {
                HostService.getVmById($stateParams.vmId).then(function (data) {
                    vm.vmModel = data;
                    getVmStatusClass();
                    getVolumeList();
                }, function () {
                    $state.go('app.cloudhost.tab.host');
                });
            };

            refreshVmInfo();
            /*定时刷新云主机API*/
            vm.flushVmInfo = function () {
                if (vm.vmModel.vmStatus == 'BUILDING'
                    || vm.vmModel.vmStatus == 'SHUTOFFING'
                    || vm.vmModel.vmStatus == 'STARTING'
                    || vm.vmModel.vmStatus == 'REBOOT'
                    || vm.vmModel.vmStatus == 'DELETING'
                    || vm.vmModel.vmStatus == 'RESUMING'
                    || vm.vmModel.vmStatus == 'SUSPENDEDING'
                    || vm.vmModel.vmStatus == 'RESIZE'
                    || vm.vmModel.vmStatus == 'RESIZED'
                    || vm.vmModel.vmStatus == 'VERIFY_RESIZE') {
                    refreshVmInfo();
                }
            };
            vm.flushVolume = function () {
                var i, item;
                for (i = 0; i < vm.volumeList.length; i++) {
                    item = vm.volumeList[i];
                    if (item.volStatus == 'DELETING'
                        || item.volStatus == 'CREATING'
                        || item.volStatus == 'DOWNLOADING'
                        || item.volStatus == 'DETACHING'
                        || item.volStatus == 'ATTACHING') {
                        getVolumeList();
                        break;
                    }
                }
            };
            /*云主机控制台*/
            vm.consoleVm = function () {
                eayunModal.open({
                    templateUrl: 'controllers/cloudhost/console.html',
                    controller: 'CloudhostHostConsoleCtrl',
                    controllerAs: 'console',
                    resolve: {
                        vmModel: function () {
                            return vm.vmModel;
                        }
                    }
                });
            };
            /*启动云主机*/
            vm.startVm = function () {
                HostService.startVm(vm.vmModel).then(function () {
                    toast.success('云主机启动中');
                    refreshVmInfo();
                }, function () {

                });
            };
            /*关闭云主机*/
            vm.shutdownVm = function () {
                eayunModal.confirm('确定要关闭云主机' + vm.vmModel.vmName + '？').then(function () {
                    HostService.shutdownVm(vm.vmModel).then(function () {
                        toast.success('云主机关闭中');
                        refreshVmInfo();
                    }, function () {

                    });
                });
            };
            /*重启云主机*/
            vm.restartVm = function () {
                eayunModal.confirm('确定要重启云主机？重启期间无法提供服务').then(function () {
                    HostService.restartVm(vm.vmModel).then(function () {
                        toast.success('云主机重启中');
                        refreshVmInfo();
                    }, function () {

                    });
                });
            };
            /*暂停服务云主机*/
            vm.suspendVm = function () {
                eayunModal.confirm('执行此操作后，云主机将暂停使用，请确定账户异常或者其他理由你需要手动暂停该云主机').then(function () {
                    HostService.suspendVm(vm.vmModel).then(function () {
                        toast.success('云主机暂停服务中');
                        refreshVmInfo();
                    }, function () {

                    });
                });
            };
            /*恢复云主机*/
            vm.resumeVm = function () {
                HostService.resumeVm(vm.vmModel).then(function () {
                    toast.success('云主机恢复中');
                    refreshVmInfo();
                }, function () {

                });
            };
            /*挂载云硬盘*/
            vm.mountDisk = function () {
                HostService.getUnBindDisk(vm.vmModel.prjId).then(function (dataFirst) {
                    var _unBindDiskList = dataFirst;
                    if (_unBindDiskList.length == 0) {
                        eayunModal.warning('您暂无可用的云硬盘，请创建后操作');
                        return;
                    } else {
                        HostService.getDiskCountByVm(vm.vmModel.vmId).then(function (dataSecond) {
                            var _diskCount = dataSecond;
                            var _maxDiskCount = 5;
                            if (_diskCount >= _maxDiskCount) {
                                eayunModal.warning('可挂载的硬盘数量已满!');
                                return;
                            } else {
                                var result = eayunModal.dialog({
                                    showBtn: false,
                                    title: '挂载云硬盘',
                                    width: '600px',
                                    templateUrl: 'controllers/cloudhost/mountdisk.html',
                                    controller: 'CloudhostHostMountDiskCtrl',
                                    controllerAs: 'mount',
                                    resolve: {
                                        vmModel: function () {
                                            return vm.vmModel;
                                        },
                                        unBindDiskList: function () {
                                            return _unBindDiskList;
                                        },
                                        maxDiskCount: function () {
                                            return _maxDiskCount;
                                        },
                                        diskCount: function () {
                                            return _diskCount;
                                        }
                                    }
                                });
                                result.then(function () {
                                    refreshVmInfo();
                                });
                            }
                        });
                    }
                });
            };
            /*查看监控*/

            /*绑定公网IP*/
            vm.bindFloatIp = function () {
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '绑定公网IP',
                    width: '600px',
                    templateUrl: 'controllers/cloudhost/bindfloatip.html',
                    controller: 'CloudhostHostFloatIpCtrl',
                    controllerAs: 'float',
                    resolve: {
                        vmModel: function () {
                            return vm.vmModel;
                        }
                    }
                });
                result.then(function (resultData) {
                    HostService.bindFloatIp(resultData).then(function () {
                        toast.success('绑定' + resultData.floIp + '成功');
                        refreshVmInfo();
                    });
                });
            };
            /*解绑公网IP*/
            vm.unbindFloatIp = function () {
                eayunModal.confirm('确定要解绑公网IP' + vm.vmModel.floatIp + '？').then(function () {
                    HostService.unBindIpByVmId(vm.vmModel).then(function () {
                        toast.success('云主机解绑公网IP成功');
                        refreshVmInfo();
                    }, function () {

                    });
                });
            };
            /*创建镜像*/
            vm.createSnapshot = function () {
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '创建自定义镜像',
                    width: '600px',
                    templateUrl: 'controllers/cloudhost/image.html',
                    controller: 'CloudhostHostImageCtrl',
                    controllerAs: 'image',
                    resolve: {
                        vmModel: function () {
                            return vm.vmModel;
                        }
                    }
                });
                result.then(function () {
                    $state.go('app.cloudhost.tab.image.customimage');
                });
            };
            /*升级配置*/
            vm.upgradeVm = function () {
                if (vm.vmModel.vmStatus != 'SHUTOFF') {
                    eayunModal.error('请先关闭云主机');
                } else {
                    HostService.getProListByDcId(vm.vmModel.dcId).then(function (data) {
                        angular.forEach(data, function (project) {
                            if (project.projectId == vm.vmModel.prjId) {
                                projectInfo = project;
                            }
                        });
                        var result = eayunModal.dialog({
                            showBtn: false,
                            title: '升级配置',
                            width: '600px',
                            templateUrl: 'controllers/cloudhost/upgrade.html',
                            controller: 'CloudhostHostUpgradeCtrl',
                            controllerAs: 'upgrade',
                            resolve: {
                                vmModel: function () {
                                    return vm.vmModel;
                                },
                                project: function () {
                                    return projectInfo;
                                }
                            }
                        });
                        result.then(function (resultData) {
                            HostService.upgradeVm(resultData).then(function () {
                                toast.success('正在升级配置，请稍后');
                                refreshVmInfo();
                            });
                        });
                    });
                }
            };
            /*编辑安全组*/
            vm.editSecurityGroup = function () {
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '编辑安全组',
                    width: '600px',
                    templateUrl: 'controllers/cloudhost/securitygroup.html',
                    controller: 'CloudhostHostSecurityGroupCtrl',
                    controllerAs: 'editSG',
                    resolve: {
                        vmModel: function () {
                            return vm.vmModel;
                        },

                    }
                });
                result.then(function (resultData) {
                    HostService.editVmSecurityGroup(resultData).then(function () {
                        toast.success('更新安全组成功');
                        refreshVmInfo();
                    }, function () {

                    });
                });
            };
            /*查看日志*/
            vm.getVmLog = function () {
                if (vm.vmModel.vmStatus == 'ERROR') {
                    eayunModal.error('云主机故障，无法查看日志');
                } else {
                    eayunModal.dialog({
                        showBtn: false,
                        title: '云主机日志',
                        width: '900px',
                        templateUrl: 'controllers/cloudhost/log.html',
                        controller: 'CloudhostHostLogCtrl',
                        controllerAs: 'log',
                        resolve: {
                            vmModel: function () {
                                return vm.vmModel;
                            }
                        }
                    });
                }
            };
            /*删除云主机*/
            vm.deleteVm = function () {
                HostService.getVm(vm.vmModel.vmId).then(function (response){
                    if(response.vmStatus == 'SUSPENDED'){
                        eayunModal.error('云主机已暂停服务，请执行恢复操作后重试');
                    }
                    else{
                        var result = eayunModal.open({
                            templateUrl: 'controllers/cloudhost/deletevm.html',
                            controller: 'CloudhostDeleteVmCtrl',
                            controllerAs: 'delVm',
                            resolve: {
                                vmModel: function () {
                                    return vm.vmModel;
                                },
                                warningMsg:function(){
                                    return warningMsg;
                                }
                            }
                        }).result;
                        result.then(function (resultData) {
                            refreshVmInfo();
                        },function(){
                            refreshVmInfo();
                        });
                    }
                });

                /*eayunModal.confirm('确定要删除云主机' + vm.vmModel.vmName + '？').then(function () {
                    HostService.deleteVm(vm.vmModel).then(function () {
                        WarningService.getUnhandledAlarmMsgCount(warningMsg);
                        toast.success('云主机删除中');
                        $state.go('app.cloudhost.tab.host');
                    }, function () {

                    });
                });*/
            };
            /*将云主机名称、描述变为可编辑状态*/
            vm.editNameOrDesc = function (type) {
                if (type == 'vmName') {
                    vm.vmNameEditable = true;
                    vm.vmDescEditable = false;
                    vm.hintNameShow = true;
                    vm.hintDescShow = false;
                }
                if (type == 'vmDesc') {
                    vm.vmNameEditable = false;
                    vm.vmDescEditable = true;
                    vm.hintNameShow = false;
                    vm.hintDescShow = true;
                }
                vm.vmEditModel = angular.copy(vm.vmModel, {});
            };
            /*校验编辑云主机名称是否存在*/
            vm.checkVmNameExist = function () {
                vm.vmModel.number = 1;
                HostService.checkVmName(vm.vmEditModel).then(function (data) {
                    vm.checkVmNameFlag = data;
                });
            };
            /*保存编辑的云主机名称、描述,并刷新界面*/
            vm.saveEdit = function (type) {
                HostService.updateVm(vm.vmEditModel).then(function () {
                    if (type == 'vmName') {
                        vm.vmNameEditable = false;
                        vm.hintNameShow = false;
                    }
                    if (type == 'vmDesc') {
                        vm.vmDescEditable = false;
                        vm.hintDescShow = false;
                    }
                    refreshVmInfo();
                });
            };
            /*取消云主机名称、描述的可编辑状态*/
            vm.cancelEdit = function (type) {
                if (type == 'vmName') {
                    vm.vmNameEditable = false;
                    vm.hintNameShow = false;
                }
                if (type == 'vmDesc') {
                    vm.vmDescEditable = false;
                    vm.hintDescShow = false;
                }
            };
            /*创建云硬盘快照*/
            vm.createVolumeSnapshot = function (_volume) {
                var result = eayunModal.dialog({
                    showBtn: true,
                    title: '创建云硬盘快照',
                    width: '600px',
                    templateUrl: 'controllers/cloudhost/cloudvolume/addsnapshot.html',
                    controller: 'CloudhostSnapshotCreateCtrl',
                    controllerAs: 'addsnap',
                    resolve: {
                        volume: function () {
                            return _volume;
                        }
                    }
                });
                result.then(function (resultData) {
                    VolumeService.addSnapshot(resultData).then(function (response) {
                        if (response.respCode == SysCode.success) {
                            toast.success('快照' + (resultData.snapName.length > 9 ? resultData.snapName.substring(0, 8) + '...' : resultData.snapName) + '开始创建');
                        } else {
                            toast.success('快照' + (resultData.snapName.length > 9 ? resultData.snapName.substring(0, 8) + '...' : resultData.snapName) + '创建失败');
                        }
                        //vm.table.api.draw();
                    });
                });
            };
            /*解绑云硬盘*/
            vm.unbindVolume = function (_volume) {
                eayunModal.confirm('确定要解绑云硬盘' + (_volume.volName.length > 7 ? _volume.volName.substr(0, 7) + '...' : _volume.volName) + '？').then(function () {
                    HostService.unbindVolume($stateParams.vmId, _volume).then(function () {
                        toast.success('开始解绑云硬盘');
                        refreshVmInfo();
                    }, function () {

                    });
                });
            };

            /*修改子网*/
            vm.modifySubnet = function(){
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '修改子网',
                    width: '600px',
                    templateUrl: 'controllers/cloudhost/modifysubnet.html',
                    controller: 'CloudhostModifySubnetCtrl',
                    controllerAs: 'modifySub',
                    resolve: {
                        vmModel: function () {
                            return vm.vmModel;
                        }
                    }
                });

                result.then(function (resultData) {
                    refreshVmInfo();
                },function(){
                    refreshVmInfo();
                });
            };
            /* 状态恢复 */
            vm.refreshVmStatus = function(){
                var reqData = {
                    vmId:vm.vmModel.vmId,
                    vmName:vm.vmModel.vmName,
                    prjId:vm.vmModel.prjId
                };
                HostService.refreshVmStatus(reqData).then(function () {
                    toast.success('云主机状态恢复中');
                    refreshVmInfo();
                }, function (message) {
                    eayunModal.error(message);
                    refreshVmInfo();
                });
            };
        }]);