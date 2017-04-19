/**
 * Created by ZHL on 2016/4/7.
 */
'use strict';

angular.module('eayun.net')
    .controller('NetExternalDetailCtrl', ['$stateParams', 'eayunModal', 'NetExternal', 'SysCode', 'toast', 'utils',
        function ($stateParams, eayunModal, NetExternal, SysCode, toast, utils) {
            var vm = this;

            vm.outModel = {};

            vm.table = {
                api: {},
                source: '/api/ecmc/virtual/outsubnetwork/querysubnetwork',
                getParams: function () {
                    return {
                        netId: $stateParams.netId,
                        dcId: vm.outModel.dcId
                    };
                }
            };

            NetExternal.getOutNetworkDetail($stateParams.netId).then(function (response) {
                vm.outModel = response.data;
                vm.table.api.draw();
            });

            vm.add = function () {
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '添加外部网络子网',
                    width: '800px',
                    templateUrl: 'controllers/net/external/add/add.html',
                    controller: 'NetExternalAddSubnetCtrl',
                    controllerAs: 'subnetAdd',
                    resolve: {
                        netId: function () {
                            return vm.outModel.netId;
                        },
                        prjId: function () {
                            return vm.outModel.prjId;
                        },
                        dcId: function () {
                            return vm.outModel.dcId;
                        }
                    }
                });
                result.then(function (resultData) {
                    vm.table.api.draw();
                });
            };

            vm.edit = function (_subnetModel) {
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '编辑外部网络子网',
                    width: '800px',
                    templateUrl: 'controllers/net/external/edit/edit.html',
                    controller: 'NetExternalEditSubnetCtrl',
                    controllerAs: 'subnetEdit',
                    resolve: {
                        subnetModel: function () {
                            return _subnetModel;
                        },
                        dcId: function () {
                            return vm.outModel.dcId;
                        }
                    }
                });
                result.then(function (resultData) {
                    vm.table.api.draw();
                });
            };

            vm.delete = function (_subnetModel) {
                eayunModal.confirm('确定要删除外部子网吗？').then(function () {
                    _subnetModel.dcId = vm.outModel.dcId;
                    NetExternal.deleteOutSubnet(_subnetModel).then(function (response) {
                        switch (response.respCode) {
                            case SysCode.error:
                                eayunModal.error("删除外部子网" + _subnetModel.subnetName + "失败");
                                return;
                            case SysCode.success:
                                toast.success("删除外部子网" + utils.ellipsis(_subnetModel.subnetName, 8) + "成功");
                                vm.table.api.draw();
                                return;
                            default:
                                toast.success("删除外部子网" + utils.ellipsis(_subnetModel.subnetName, 8) + "成功");
                                vm.table.api.draw();
                                return;
                        }
                    }, function () {

                    });
                });
            }
        }]);