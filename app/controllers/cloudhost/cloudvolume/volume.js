/**
 * Created by eayun on 2016/3/21.
 */
'use strict';

angular.module('eayun.cloudhost')
    .controller('CloudhostVolumeCtrl', ['$state', '$scope', 'HomeCommonService', 'HostService', 'VolumeService', 'eayunModal', 'toast', 'SysCode',
        function ($state, $scope, HomeCommonService, HostService, VolumeService, eayunModal, toast, SysCode) {
            var vm = this;

            vm.search = '';
            vm.options = {
                searchFn: function () {
                    vm.table.api.draw();
                },
                select: [{name: '名称'}, {prjName: '项目'}, {cusOrg: '客户'}],
                series: {
                    prjName: {
                        multi: true,
                        data: function () {
                            return HomeCommonService.getAllPrjName().then(function (data) {
                                return data;
                            });
                        }
                    },
                    cusOrg: {
                        multi: true,
                        data: function () {
                            return HomeCommonService.getAllCusOrgName().then(function (data) {

                                return data;
                            });
                        }
                    }
                },
                checkbox: true
            };


            vm.table = {
                api: {},
                source: '/api/ecmc/cloud/volume/getvolumelist',
                getParams: function () {
                    return {
                        dcId: vm.dcId,
                        queryType: vm.search.key,
                        queryName: vm.search.value
                    };
                },
                result: []
            };

            vm.query = function () {
                vm.table.api.draw();
            };

            //查询全部数据中心
            HomeCommonService.getDcList().then(function (data) {
                vm.dcList = data;
            });

            vm.queryTable = function () {
                vm.table.api.refresh();
            };
            vm.refresh = function () {
                var i, item;
                for (i = 0; i < vm.table.result.length; i++) {
                    item = vm.table.result[i];
                    if (item.volStatus == 'CREATING'
                        || item.volStatus == 'DETACHING'
                        || item.volStatus == 'DELETING'
                        || item.volStatus == 'DOWNLOADING'
                        || item.volStatus == 'ATTACHING'
                        || item.volStatus == "RESTORING-BACKUP"
                        || item.volStatus == "BACKING-UP") {
                        vm.queryTable();
                        break;
                    }
                }
            };
            vm.volumeStatusClass = [];

            //状态颜色
            vm.checkVolStatus = function (_volModel, _index) {
                vm.volumeStatusClass[_index] = '';
                if(_volModel.volStatus == 'DELETING'){
                    return 'yellow';
                }
                if(_volModel.chargeState != '0') {
                    return 'gray';
                }
                if (_volModel.volStatus == 'IN-USE') {
                    return 'green';
                }
                else if(_volModel.volStatus == 'AVAILABLE'){
                    return 'space';
                }
                else if (_volModel.volStatus == 'ERROR') {
                    return 'red';
                }
                else if (_volModel.volStatus == 'CREATING' || _volModel.volStatus == 'DOWNLOADING'
                            || _volModel.volStatus == 'ATTACHING' || _volModel.volStatus == 'DETACHING'
                            || _volModel.volStatus =="RESTORING-BACKUP"|| _volModel.volStatus =="BACKING-UP") {
                    return 'yellow';
                }
                else {
                    return 'red';
                }
            };


            //删除云硬盘
            vm.deleteVolume = function (volModel) {

                if('CREATING' == volModel.volStatus){
                    eayunModal.warning("云硬盘创建中，请稍候");
                    return;
                }
                if('DELETING' == volModel.volStatus){
                    eayunModal.warning("云硬盘删除中，请稍候");
                    return;
                }
                if('ATTACHING' == volModel.volStatus){
                    eayunModal.warning("云硬盘挂载中，请稍候");
                    return;
                }
                if('DETACHING' == volModel.volStatus){
                    eayunModal.warning("云硬盘解绑中，请稍候");
                    return;
                }

                if('IN-USE' == volModel.volStatus && null != volModel.vmId && '' != volModel.vmId && 'null' != volModel.vmId){
                    eayunModal.warning("云硬盘已挂载，请解绑后操作");
                    return;
                }
                if('RESTORING-BACKUP' == volModel.volStatus){
                    eayunModal.warning("云硬盘恢复数据中，请稍后再试");
                    return;
                }
                if('BACKING-UP'== volModel.volStatus){
                    eayunModal.warning("云硬盘快照创建中，请稍后再试");
                    return;
                }

                var result = eayunModal.open({
                    templateUrl: 'controllers/cloudhost/cloudvolume/deletevolume.html',
                    controller: 'DeleteVolume',
                    resolve: {
                        volModel: function () {
                            return volModel;
                        }
                    }
                }).result;
                result.then(function (model){
                    if(model.isDeleted != null && model.isDeleted == '1'){
                        var page1 = eayunModal.open({
                            templateUrl: 'controllers/net/deletetwo.html',
                            controller: 'DeleteResourceInfo2',
                            controllerAs: 'delRes2',
                            resolve: {
                                name: function () {
                                    return model.volName;
                                }
                            }
                        }).result;
                        page1.then(function () {
                            VolumeService.deleteVolume(model).then(function (response) {
                                if (response.respCode == SysCode.success) {
                                    toast.success('删除云硬盘' + (volModel.volName.length > 9 ? volModel.volName.substring(0, 8) + '...' : volModel.volName) + '成功');
                                } else {
                                    toast.success('删除云硬盘' + (volModel.volName.length > 9 ? volModel.volName.substring(0, 8) + '...' : volModel.volName) + '失败');
                                }
                                vm.table.api.draw();
                            });
                        });
                    }else{
                        VolumeService.deleteVolume(model).then(function (response) {
                            if (response.respCode == SysCode.success) {
                                toast.success('删除云硬盘' + (volModel.volName.length > 9 ? volModel.volName.substring(0, 8) + '...' : volModel.volName) + '成功');
                            } else {
                                toast.success('删除云硬盘' + (volModel.volName.length > 9 ? volModel.volName.substring(0, 8) + '...' : volModel.volName) + '失败');
                            }
                            vm.table.api.draw();
                        });
                    }
                },function () {});
            };

            //创建云硬盘
            vm.create = function () {
                var result = eayunModal.dialog({
                    showBtn: true,
                    title: '创建云硬盘',
                    width: '650px',
                    templateUrl: 'controllers/cloudhost/cloudvolume/addvolume.html',
                    controller: 'CloudhostVolumeCreateCtrl',
                    controllerAs: 'add',
                    resolve: {}
                });
                result.then(function (resultData) {
                    resultData.diskFrom = 'blank';
                    VolumeService.addVolume(resultData).then(function (response) {
                        if (response.respCode == SysCode.success) {
                            toast.success('云硬盘' + (resultData.volName.length > 9 ? resultData.volName.substring(0, 8) + '...' : resultData.volName) + '创建成功');
                        } else {
                            toast.success('云硬盘' + (resultData.volName.length > 9 ? resultData.volName.substring(0, 8) + '...' : resultData.volName) + '创建失败');
                        }
                        vm.table.api.draw();
                    });
                });
            };


            //挂载云硬盘
            vm.bindVolume = function (volModel) {
                var result = eayunModal.dialog({
                    showBtn: true,
                    title: '挂载云硬盘',
                    width: '600px',
                    templateUrl: 'controllers/cloudhost/cloudvolume/bindvolume.html',
                    controller: 'CloudhostVolumeBindCtrl',
                    controllerAs: 'bind',
                    resolve: {
                        volume: function () {
                            return volModel;
                        }
                    }
                });
                result.then(function (resultData) {
                    VolumeService.bindVolume(resultData).then(function (response) {
                        if (response.respCode == SysCode.success) {
                            toast.success('云硬盘挂载至' + (resultData.vmName.length > 9 ? resultData.vmName.substring(0, 8) + '...' : resultData.vmName) + '成功');
                        } else {
                            toast.success('云硬盘挂载至' + (resultData.vmName.length > 9 ? resultData.vmName.substring(0, 8) + '...' : resultData.vmName) + '失败');
                        }
                        vm.table.api.draw();
                    });
                });
            };


            //解绑云硬盘
            vm.debindVolume = function (volModel) {
                eayunModal.confirm('确定解绑云硬盘' + volModel.volName + '?').then(function () {
                    VolumeService.debindVolume(volModel).then(function (response) {
                        if (response.respCode == SysCode.success) {
                            toast.success('云硬盘解绑成功');
                        } else {
                            toast.success('云硬盘解绑失败');
                        }
                        vm.table.api.draw();
                    });

                });
            };


            //创建云硬盘快照
            vm.createSnapshot = function (volModel) {
                var result = eayunModal.dialog({
                    showBtn: true,
                    title: '创建云硬盘快照',
                    width: '600px',
                    templateUrl: 'controllers/cloudhost/cloudvolume/addsnapshot.html',
                    controller: 'CloudhostSnapshotCreateCtrl',
                    controllerAs: 'addsnap',
                    resolve: {
                        volume: function () {
                            return volModel;
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
                    });
                });
            };

            //进入云主机详情页
            vm.goToVm = function (vmId) {
                if (null == vmId || 'null' == vmId || '' == vmId) {
                    return;
                } else {
                    $state.go('app.cloudhost.vmdetail', {vmId: vmId});
                }

            };

        }]);