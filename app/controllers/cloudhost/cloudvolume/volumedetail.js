/**
 * Created by eayun on 2016/4/25.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('CloudhostVolumeDetailCtrl', ['$stateParams', '$state', '$scope', 'VolumeService', 'SnapshotService', 'eayunModal', 'SysCode', 'toast', '$timeout', function ($stateParams, $state, $scope, VolumeService, SnapshotService, eayunModal, SysCode, toast, $timeout) {
        var vm = this;
        vm.volumeStatusClass = '';
        vm.snapStatusClass = [];
        vm.volumeModel = {};
        vm.snapshotList = {};
        vm.item = {};
        vm.volNameEditable = false;
        vm.volDescEditable = false;

        //状态颜色
        var checkVolStatus = function () {
            vm.volumeStatusClass = '';
            if(vm.volumeModel.volStatus == 'DELETING'){
                vm.volumeStatusClass = 'yellow';
                return ;
            }
            if(vm.volumeModel.chargeState != '0') {
                vm.volumeStatusClass = 'gray';
                return ;
            }
            if (vm.volumeModel.volStatus == 'IN-USE') {
                vm.volumeStatusClass = 'green';
            }
            else if(vm.volumeModel.volStatus == 'AVAILABLE'){
                vm.volumeStatusClass = 'space';
            }
            else if (vm.volumeModel.volStatus == 'ERROR') {
                vm.volumeStatusClass = 'red';
            }
            else if (vm.volumeModel.volStatus == 'CREATING' || vm.volumeModel.volStatus == 'DOWNLOADING'
                    || vm.volumeModel.volStatus == 'ATTACHING'  || vm.volumeModel.volStatus == 'DETACHING'
                    || vm.volumeModel.volStatus =="RESTORING-BACKUP"||vm.volumeModel.volStatus =="BACKING-UP") {
                vm.volumeStatusClass = 'yellow';

            }
            else {
                vm.volumeStatusClass = 'red';
            }
        };


        /*刷新云硬盘*/
        var refreshVolumeInfo = function () {
            VolumeService.getVolumeById($stateParams.volId).then(function (data) {
                vm.volumeModel = data;
                if (null == vm.volumeModel.volDescription || 'null' == vm.volumeModel.volDescription) {
                    vm.volumeModel.volDescription = '';
                }
                checkVolStatus();
                if('1'==vm.volumeModel.isDeleted||'2'==vm.volumeModel.isDeleted){
                    $state.go('app.cloudhost.tab.volume');
                }
            }, function () {
                $state.go('app.cloudhost.tab.volume');
            });
        };
        refreshVolumeInfo();


        vm.table = {
            api: {},
            source: '/api/ecmc/cloud/snapshot/getsnaplistbyvolid',
            getParams: function () {
                return {
                    volId: $stateParams.volId
                };
            },
            result: []
        };

        vm.queryTable = function () {
            vm.table.api.draw();
        };


        //快照状态
        vm.getSnapshotStatus = function (snapModel, _index) {
            vm.snapStatusClass[_index] = '';
            if(snapModel.chargeState != '0') {
                return  'gray';
            }
            if (snapModel.snapStatus && snapModel.snapStatus == 'AVAILABLE') {
                return 'green';
            }
            else if (snapModel.snapStatus == 'ERROR') {
                return 'red';
            }
            else if (snapModel.snapStatus == 'CREATING' || snapModel.snapStatus == 'DELETING' || snapModel.snapStatus == 'RESTORING') {
                return 'yellow';
            }
            else{
                return 'red';
            }
        };


        vm.refresh = function () {
            var i, item;
            for (i = 0; i < vm.table.result.length; i++) {
                item = vm.table.result[i];
                if (item.snapStatus == 'CREATING'
                    || item.snapStatus == 'DELETING'
                    || item.snapStatus == "RESTORING") {
                    vm.queryTable();
                    break;
                }
            }
        };


        //保存编辑的云硬盘名称、描述,并刷新界面
        vm.saveEdit = function (type) {
            VolumeService.updateVolume(vm.volEditModel).then(function (response) {
                if (type == 'volName') {
                    vm.hintNameShow = false;
                    vm.volNameEditable = false;
                }
                if (type == 'volDesc') {
                    vm.hintDescShow = false;
                    vm.volDescEditable = false;
                }
                refreshVolumeInfo();
            });
        };


        //将云硬盘名称、描述变为可编辑状态
        vm.edit = function (type) {
            if (type == 'volName') {
                vm.hintNameShow = true;
                vm.hintDescShow = false;
                vm.volNameEditable = true;
                vm.volDescEditable = false;
            }
            if (type == 'volDesc') {
                vm.hintNameShow = false;
                vm.hintDescShow = true;
                vm.volNameEditable = false;
                vm.volDescEditable = true;
            }
            vm.volEditModel = angular.copy(vm.volumeModel, {});
        };


        //取消云硬盘名称、描述的可编辑状态
        vm.cancleEdit = function (type) {
            if (type == 'volName') {
                vm.hintNameShow = false;
                vm.volNameEditable = false;
            }
            if (type == 'volDesc') {
                vm.hintDescShow = false;
                vm.volDescEditable = false;
            }
        };


        //校验名称格式和唯一性
        vm.checkVolumeName = function (value) {
            var model = vm.volEditModel;
            model.volName = value;
            return VolumeService.checkVolName(model).then(function (data) {
                if (true == data) {
                    return false;
                } else {
                    return true;
                }
            });
        };


        /*根据快照创建云硬盘*/
        vm.addVolumeBySnapshot = function (snapModel) {
            var result = eayunModal.dialog({
                showBtn: true,
                title: '创建云硬盘',
                width: '650px',
                templateUrl: 'controllers/cloudhost/cloudsnapshot/addvolume.html',
                controller: 'CloudhostSnapVolCreateCtrl',
                controllerAs: 'addvol',
                resolve: {
                    snapshot: function () {
                        snapModel.prjName = vm.volumeModel.prjName;
                        snapModel.dcName = vm.volumeModel.dcName;
                        return snapModel;
                    }
                }
            });
            result.then(function (resultData) {
                SnapshotService.addVolumeBySnapshot(resultData).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        toast.success('云硬盘' + (resultData.volName.length > 9 ? resultData.volName.substring(0, 8) + '...' : resultData.volName) + '创建成功');
                    } else {
                        toast.success('云硬盘' + (resultData.volName.length > 9 ? resultData.volName.substring(0, 8) + '...' : resultData.volName) + '创建失败');
                    }
                });
            });

        };


        //创建云硬盘快照
        vm.addSnapshot = function (volModel) {
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
                    vm.table.api.draw();
                });
            });
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
            if('BACKING-UP'==volModel.volStatus){
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
                            $state.go('app.cloudhost.tab.volume');
                            // refreshVolumeInfo();
                        });
                    });
                }else{
                    VolumeService.deleteVolume(model).then(function (response) {
                        if (response.respCode == SysCode.success) {
                            toast.success('删除云硬盘' + (volModel.volName.length > 9 ? volModel.volName.substring(0, 8) + '...' : volModel.volName) + '成功');
                        } else {
                            toast.success('删除云硬盘' + (volModel.volName.length > 9 ? volModel.volName.substring(0, 8) + '...' : volModel.volName) + '失败');
                        }
                        $state.go('app.cloudhost.tab.volume');
                       //  refreshVolumeInfo();
                    });
                }
            },function () {});
        };

        vm.rollBack = function (_cloudSnapshot) {
            $scope.notice = '';
            VolumeService.getVolumeById(_cloudSnapshot.volId).then(function (data) {
                var volume = data;
                $scope.notice = VolumeService.getNotice(volume, _cloudSnapshot);
                if (angular.isDefined($scope.notice) && $scope.notice != null && '' != $scope.notice) {
                    eayunModal.warning($scope.notice);
                    return;
                }
                _cloudSnapshot.$$volName = volume.volName;
                _cloudSnapshot.$$volBootable = volume.volBootable;
                var result = eayunModal.open({
                    templateUrl: 'controllers/cloudhost/cloudvolume/backvolume.html',
                    controller: 'RollBackVolume',
                    resolve: {
                        snapshot: function () {
                            return _cloudSnapshot;
                        }

                    }
                }).result;
                result.then(function (value) {
                    VolumeService.rollBack(value).then(function (data) {
                        toast.success('云硬盘快照回滚中');//回滚成功的信息
                        refreshVolumeInfo();
                        vm.table.api.draw();
                    }, function (message) {
                        refreshVolumeInfo();
                        eayunModal.warning(message);
                    });
                }, function () {
                    //console.info('取消');
                });
            }, function () {
            });
        }
        vm.deleteSnapshot = function (_snapshot) {
            if('RESTORING' == _snapshot.snapStatus){
                eayunModal.warning("备份占用中，请稍后重试");
                return;
            }
            if('CREATING' == _snapshot.snapStatus){
                eayunModal.warning("快照创建中，请稍后重试");
                return;
            }
            if('DELETING' == _snapshot.snapStatus){
                eayunModal.warning("快照删除中，请稍后重试");
                return;
            }
            var result = eayunModal.open({
                templateUrl: 'controllers/cloudhost/cloudvolume/deletesnapshot.html',
                controller: 'DeleteSnapshot',
                resolve: {
                    snapshot: function () {
                        return _snapshot;
                    }
                }
            }).result;
            result.then(function (value) {
                if(value.isDeleted != null && value.isDeleted == '1'){
                    var page1 = eayunModal.open({
                        templateUrl: 'controllers/net/deletetwo.html',
                        controller: 'DeleteResourceInfo2',
                        controllerAs: 'delRes2',
                        resolve: {
                            name: function () {
                                return value.snapName;
                            }
                        }
                    }).result;
                    page1.then(function () {
                        VolumeService.deleteSnapshot(value).then(function () {
                            toast.success('删除云硬盘快照成功');//删除成功的信息
                            vm.table.api.draw();
                        }, function (message) {
                            eayunModal.warning(message);
                        });
                    });
                }else{
                    VolumeService.deleteSnapshot(value).then(function () {
                        toast.success('删除云硬盘快照成功');//删除成功的信息
                        vm.table.api.draw();
                    }, function (message) {
                        eayunModal.warning(message);
                    });
                }
            }, function () {
            });
        };
        vm.flushVolInfo = function () {
            var status = vm.volumeModel.volStatus;
            if("DELETING" == status
                || "CREATING" == status
                || "DOWNLOADING" == status
                || "DETACHING" == status
                || "ATTACHING" == status
                || "RESTORING-BACKUP" == status
                || "BACKING-UP" == status){
                refreshVolumeInfo();
            }
        };
    }]);