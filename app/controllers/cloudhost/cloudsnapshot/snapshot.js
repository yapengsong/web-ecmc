/**
 * Created by eayun on 2016/3/21.
 */
'use strict';

angular.module('eayun.cloudhost')
    .controller('CloudhostSnapshotCtrl', ['$state','$scope','HomeCommonService','SnapshotService', 'eayunModal','toast', 'SysCode','$timeout', function ($state,$scope,HomeCommonService,SnapshotService,eayunModal,toast,SysCode,$timeout) {
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
            source: '/api/ecmc/cloud/snapshot/getsnapshotlist',
            getParams: function () {
                return {
                    dcId: vm.dcId,
                    isDeleted:'0',
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
                if (item.snapStatus == 'CREATING'
                    || item.snapStatus == 'DELETING'
                    || item.snapStatus == "RESTORING") {
                    vm.queryTable();
                    break;
                }
            }
        };

        vm.snapStatusClass=[];
        //快照状态
        vm.getSnapshotStatus = function (snapModel, _index) {
            vm.snapStatusClass[_index] = '';
            if(snapModel.snapStatus=='DELETING'){
                return 'yellow';
            }
            if(snapModel.chargeState != '0') {
                return  'gray';
            }
            if(snapModel.snapStatus && snapModel.snapStatus=='AVAILABLE'){
                return 'green';
            }
            else if(snapModel.snapStatus=='ERROR'){
                return 'red';
            }
            else if(snapModel.snapStatus=='CREATING' || snapModel.snapStatus == 'RESTORING'){
                return 'yellow';
            }
            else {
                return 'red';
            }
        };

        //删除云硬盘快照
        vm.deleteSnapshot = function(snapModel){
            if('RESTORING' == snapModel.snapStatus){
                eayunModal.warning("备份占用中，请稍后重试");
                return;
            }
            if('CREATING' == snapModel.snapStatus){
                eayunModal.warning("快照创建中，请稍后重试");
                return;
            }
            if('DELETING' == snapModel.snapStatus){
                eayunModal.warning("快照删除中，请稍后重试");
                return;
            }
            var result = eayunModal.open({
                templateUrl: 'controllers/cloudhost/cloudvolume/deletesnapshot.html',
                controller: 'DeleteSnapshot',
                resolve: {
                    snapshot: function () {
                        return snapModel;
                    }
                }
            }).result;
            result.then(function (value){
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
                        SnapshotService.deleteSnapshot(value).then(function (response) {
                            if (response.respCode == SysCode.success) {
                                toast.success('删除快照' + (snapModel.snapName.length > 9 ?snapModel.snapName.substring(0, 8) + '...' : snapModel.snapName) + '成功');
                            } else {
                                toast.success('删除快照' + (snapModel.snapName.length > 9 ?snapModel.snapName.substring(0, 8) + '...' : snapModel.snapName) + '失败');
                            }
                            vm.table.api.draw();
                        });
                    });
                }else{
                    SnapshotService.deleteSnapshot(value).then(function (response) {
                        if (response.respCode == SysCode.success) {
                            toast.success('删除快照' + (snapModel.snapName.length > 9 ?snapModel.snapName.substring(0, 8) + '...' : snapModel.snapName) + '成功');
                        } else {
                            toast.success('删除快照' + (snapModel.snapName.length > 9 ?snapModel.snapName.substring(0, 8) + '...' : snapModel.snapName) + '失败');
                        }
                        vm.table.api.draw();
                    });
                }
            });
        };


        //更新云硬盘快照
        vm.updateSnapshot = function (snapModel) {
            if(snapModel.snapStatus != 'AVAILABLE' || snapModel.chargeState != '0'){
                return ;
            }
            var result = eayunModal.dialog({
                showBtn: false,
                title: '编辑快照',
                width: '600px',
                templateUrl: 'controllers/cloudhost/cloudsnapshot/editsnapshot.html',
                controller: 'CloudhostEditSnapshotCtrl',
                controllerAs: 'editsnap',
                resolve: {
                    snapshot: function () {
                        return snapModel;
                    }
                }
            });
            result.then(function (resultData) {
                SnapshotService.editSnapshot(resultData).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        toast.success('快照' + (resultData.snapName.length > 9 ?resultData.snapName.substring(0, 8) + '...' : resultData.snapName) + '编辑成功');
                    } else {
                        toast.success('快照' + (resultData.snapName.length > 9 ?resultData.snapName.substring(0, 8) + '...' : resultData.snapName) + '编辑失败');
                    }
                    vm.table.api.draw();
                });
            });
        };


        //创建云硬盘
        vm.createVolume = function (snapModel) {
            var result = eayunModal.dialog({
                showBtn: true,
                title: '创建云硬盘',
                width: '650px',
                templateUrl: 'controllers/cloudhost/cloudsnapshot/addvolume.html',
                controller: 'CloudhostSnapVolCreateCtrl',
                controllerAs: 'addvol',
                resolve: {
                    snapshot:function(){
                        return  snapModel;
                    }
                }
            });
            result.then(function (resultData) {
                SnapshotService.addVolumeBySnapshot(resultData).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        toast.success('云硬盘' + (resultData.volName.length > 9 ?resultData.volName.substring(0, 8) + '...' : resultData.volName) + '创建成功');
                    } else {
                        toast.success('云硬盘' + (resultData.volName.length > 9 ?resultData.volName.substring(0, 8) + '...' : resultData.volName) + '创建失败');
                    }
                });
            });
        };

        //快照详情
        vm.detail = function (snapModel) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '快照详情',
                width: '650px',
                templateUrl: 'controllers/cloudhost/cloudsnapshot/snapshotdetail.html',
                controller: 'CloudhostSnapshotDetailCtrl',
                controllerAs: 'snapdetail',
                resolve: {
                    snapshot:function(){
                        return  snapModel;
                    }
                }
            });
            result.then(function (resultData) {

            });
        };

        //进入云硬盘详情页
        vm.goToVolume=function(volId){
            if(null==volId||'null'==volId||''==volId){
                return;
            }else{
                $state.go('app.cloudhost.volumedetail',{volId: volId});
            }

        };
        vm.rollBack = function (_snap) {
            $scope.notice = '';
            SnapshotService.getVolumeById(_snap.volId).then(function (data) {
                var volume = data;
                $scope.notice = SnapshotService.getNotice(volume, _snap);
                if (angular.isDefined($scope.notice) && $scope.notice != null && '' != $scope.notice) {
                    eayunModal.warning($scope.notice);
                    return;
                }
                _snap.$$volName = data.volName;
                _snap.$$volBootable = data.volBootable;
                var result = eayunModal.open({
                    templateUrl: 'controllers/cloudhost/cloudvolume/backvolume.html',
                    controller: 'RollBackVolume',
                    resolve: {
                        snapshot:function(){
                            return _snap;
                        }

                    }
                }).result;
                result.then(function (value){
                    SnapshotService.rollBack(value).then(function (data) {
                        toast.success('云硬盘快照回滚中');//回滚成功的信息
                        vm.table.api.draw();
                    },function (message){
                        eayunModal.warning(message);
                    });
                }, function () {
                    //console.info('取消');
                });
            });
        };

    }]);