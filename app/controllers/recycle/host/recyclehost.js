/**
 * Created by zhouhaitao on 2016/8/26.
 */
'use strict';

angular.module('eayun.recycle')
    .controller('RecycleHostCtrl', ['$state', '$timeout', 'HomeCommonService', 'RecycleService', 'eayunModal', 'toast', '$scope',
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
                select: [{vmName: '名称'}, {cusOrg: '客户'}, {prjName: '项目'}],
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
                source: '/api/ecmc/cloud/vm/getrecyclevmpagelist',
                getParams: function () {
                    return {
                        dcId: vm.dcId,
                        queryType: vm.search.key,
                        queryName: vm.search.value
                    };
                },
                result: []
            };

            vm.vmStatusClass = [];

            vm.checkVmStatus = function (_vmModel, _index) {
                vm.vmStatusClass[_index] = '';
                if (_vmModel.vmStatus && _vmModel.vmStatus == 'SOFT_DELETED') {
                    return 'red';
                }
                else {
                    return 'yellow';
                }
            };

            vm.refresh = function () {
                var i, item;
                for (i = 0; i < vm.table.result.length; i++) {
                    item = vm.table.result[i];
                    if (item.vmStatus == 'SOFT_RESUME') {
                        vm.table.api.refresh();
                        break;
                    }
                }
            };

            vm.queryTable = function () {
                vm.table.api.draw();
            };

            /* 云主机详情 */
            vm.detail = function(model){
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '云主机详情',
                    width: '650px',
                    templateUrl: 'controllers/recycle/host/detail.html',
                    controller: 'RecycleHostDetailCtrl',
                    controllerAs: 'hostdetail',
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

            /* 云主机删除 */

            vm.deleteVm = function (model){
                var data = {};
                data.vmId = model.vmId;
                data.dcId = model.dcId;
                data.prjId = model.prjId;
                data.vmName = model.vmName;
                data.deleteType = '2';
                eayunModal.confirm('确定要删除云主机'+ model.vmName +'，删除后该资源无法恢复，请谨慎操作。').then(function () {
                    RecycleService.deleteVm(data).then(function () {
                        toast.success('云主机删除中');
                        vm.table.api.draw();
                    });
                });
            };
        }]);