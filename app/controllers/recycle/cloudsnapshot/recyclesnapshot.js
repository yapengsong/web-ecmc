/**
 * Created by liuzhuangzhuang on 2016/8/30.
 */
'use strict';

angular.module('eayun.recycle')
    .controller('RecycleSnapshotCtrl', ['$state', '$timeout', 'HomeCommonService', 'RecycleService', 'eayunModal', 'toast', '$scope',
        function ($state, $timeout, HomeCommonService, RecycleService, eayunModal, toast, $scope) {
            var vm = this;
            HomeCommonService.getDcList().then(function (response) {
                vm.dcList = response;
            });
            vm.search = '';
            vm.options = {
                searchFn: function () {
                    vm.table.api.draw();
                },
                select: [{snapName: '名称'}, {cusOrg: '客户'}, {prjName: '项目'}],
                series: {
                    cusOrg: {
                        multi: true,
                        data: function () {
                            return HomeCommonService.getAllCusOrgName();
                        }
                    },
                    prjName: {
                        multi: true,
                        data: function () {
                            return HomeCommonService.getAllPrjName();
                        }
                    }
                }
            };

            vm.table = {
                api: {},
                source: '/api/ecmc/cloud/snapshot/getRecycleSnapList',
                getParams: function () {
                    return {
                        dcId: vm.dcId,
                        queryType: vm.search.key,
                        queryName: vm.search.value
                    };
                },
                result: []
            };

            vm.refresh = function () {
                var i, item;
                for (i = 0; i < vm.table.result.length; i++) {
                    item = vm.table.result[i];
                    var status = item.snapStatus.toString().toLowerCase();
                    if (status == 'deleting') {
                        vm.table.api.refresh();
                        break;
                    }
                }
            };

            vm.queryTable = function () {
                vm.table.api.draw();
            };

            vm.vmStatusClass = [];

            vm.checkVmStatus = function (_snap, _index) {
                vm.vmStatusClass[_index] = '';
                if (_snap.isDeleted =='2' && _snap.snapStatus != 'DELETING') {
                    return 'red';
                }
                else {
                    return 'yellow';
                }
            };
            /* 云硬盘快照详情 */
            vm.detail = function(model){
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '云硬盘快照详情',
                    width: '650px',
                    templateUrl: 'controllers/recycle/cloudsnapshot/detail.html',
                    controller: 'RecycleSnapshotDetailCtrl',
                    controllerAs: 'snapshotdetail',
                    resolve: {
                        snapModel:function(){
                            return  model;
                        }
                    }
                });
                result.then(function (resultData) {
                    vm.table.api.draw();
                },function (){
                    vm.table.api.draw();
                });
            };
            /*云硬盘详情*/
            vm.detailVolume = function (_snap){
                RecycleService.getVolumeById(_snap.volId).then(function (data) {
                    if(null != data) {
                        data.isVolume = '0';//标志--云硬盘快照列表页点击云硬盘详情
                        var result = eayunModal.dialog({
                            showBtn: false,
                            title: '云硬盘详情',
                            width: '650px',
                            templateUrl: 'controllers/recycle/cloudvolume/detail.html',
                            controller: 'RecycleVolumeDetailCtrl',
                            controllerAs: 'volumedetail',
                            resolve: {
                                vmModel:function(){
                                    return  data;
                                }
                            }
                        });
                        result.then(function () {
                            vm.table.api.draw();
                        },function (){
                            vm.table.api.draw();
                        });
                    }
                });
            };
            /* 云硬盘快照删除 */

            vm.deleteSnap = function (model){
                var data = {};
                data.dcId = model.dcId;
                data.prjId = model.prjId;
                data.snapId = model.snapId;
                data.cusId = model.cusId;
                data.snapName = model.snapName;
                data.isDeleted = '1';
                eayunModal.confirm('确定要彻底删除云硬盘快照'+ model.snapName +'，删除后该资源无法恢复，请谨慎操作。').then(function () {
                    RecycleService.deleteSnap(data).then(function (response) {
                        if(null!=response.data&&response.data==true){
                            vm.table.api.draw();
                            toast.success('删除云硬盘快照成功',1000);
                        }
                    });
                });
            };
}]);