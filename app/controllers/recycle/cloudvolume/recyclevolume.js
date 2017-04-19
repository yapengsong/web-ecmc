/**
 * Created by liuzhuangzhuang on 2016/8/30.
 */
'use strict';

angular.module('eayun.recycle')
    .controller('RecycleVolumeCtrl', ['$state', '$timeout', 'HomeCommonService', 'RecycleService', 'eayunModal', 'toast', '$scope',
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
                select: [{volName: '名称'}, {cusOrg: '客户'}, {prjName: '项目'}],
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
                source: '/api/ecmc/cloud/volume/getRecycleVolList',
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
                    var status = item.volStatus.toString().toLowerCase();
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

            vm.checkVmStatus = function (_vmModel, _index) {
                vm.vmStatusClass[_index] = '';
                if(_vmModel.isDeleted == '2' && _vmModel.volStatus != 'DELETING') {
                    return 'red';
                }else{
                    return 'yellow';
                }
            };
            /* 云硬盘详情 */
            vm.detail = function(model){
                model.isVolume = '1';//标志--云硬盘列表页点击云硬盘详情
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '云硬盘详情',
                    width: '650px',
                    templateUrl: 'controllers/recycle/cloudvolume/detail.html',
                    controller: 'RecycleVolumeDetailCtrl',
                    controllerAs: 'volumedetail',
                    resolve: {
                        vmModel:function(){
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

            /* 云硬盘删除 */

            vm.deleteVol = function (model){
                var data = {};
                data.volId = model.volId;
                data.dcId = model.dcId;
                data.prjId = model.prjId;
                data.volName = model.volName;
                data.cusId = model.cusId;
                data.isDeleted = '1';
                eayunModal.confirm('确定要彻底删除云硬盘'+ model.volName +'，删除后该资源无法恢复，请谨慎操作。').then(function () {
                    RecycleService.deleteVol(data).then(function (response) {
                        if(null!=response.data&&response.data==true){
                            toast.success('删除云硬盘成功',1000);
                            vm.table.api.draw();
                        }
                    });
                });
            };

            /*云主机详情*/
            vm.detailHost = function (_volume) {
                RecycleService.getVmById(_volume.vmId).then(function (data) {
                    if(null != data){
                        var result = eayunModal.dialog({
                            showBtn: false,
                            title: '云主机详情',
                            width: '650px',
                            templateUrl: 'controllers/recycle/host/detail.html',
                            controller: 'RecycleHostDetailCtrl',
                            controllerAs: 'hostdetail',
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
            }
        }]);