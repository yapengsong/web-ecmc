/**
 * Created by ZHL on 2016/4/7.
 */
'use strict';

angular.module('eayun.net')
    .controller('NetPrivateDetailCtrl', ['$stateParams', 'NetPrivate', 'eayunModal', 'NetSubnet', 'toast','$scope',
        function ($stateParams, NetPrivate, eayunModal, NetSubnet, toast,$scope) {
            var vm = this;
            NetPrivate.getById($stateParams.netId).then(function (data) {
                vm.net = data;
                vm.getNetStatus(vm.net);
            });
            NetPrivate.querySubnetByNetId($stateParams.netId).then(function (data) {
                vm.subList = data;
            });
            vm.add = function () {
                var result = eayunModal.dialog({
                    showBtn:false,
                    title: '创建子网',
                    width: '800px',
                    templateUrl: 'controllers/net/private/subAdd.html',
                    controller: 'NetPrivateSubnetAddCtrl',
                    controllerAs: 'subnet',
                    resolve: {
                        subnet: function () {
                            return {
                                prjId: vm.net.prjId,
                                dcId: vm.net.dcId,
                                networkId: vm.net.netId
                            };
                        }
                    }
                });
                result.then(function () {
                    NetPrivate.querySubnetByNetId($stateParams.netId).then(function (data) {
                        vm.subList = data;
                    });
                });
            };
            vm.edit = function (subnet) {
                var result = eayunModal.dialog({
                    showBtn:false,
                    title: '编辑子网',
                    width: '650px',
                    templateUrl: 'controllers/net/private/subEdit.html',
                    controller: 'NetPrivateSubnetSaveCtrl',
                    controllerAs: 'subnet',
                    resolve: {
                        subnet: subnet
                    }
                });
                result.then(function () {
                    NetPrivate.querySubnetByNetId($stateParams.netId).then(function (data) {
                        vm.subList = data;
                    });
                });
            };
            vm.delete = function (subnet) {
                var page1 = eayunModal.open({
                    templateUrl: 'controllers/net/deleteone.html',
                    controller: 'DeleteResourceInfo1',
                    controllerAs: 'delRes1',
                    resolve: {
                        name: function () {
                            return subnet.subnetName;
                        }
                    }
                }).result;
                page1.then(function () {
                    var page2 = eayunModal.open({
                        templateUrl: 'controllers/net/deletetwo.html',
                        controller: 'DeleteResourceInfo2',
                        controllerAs: 'delRes2',
                        resolve: {
                            name: function () {
                                return subnet.subnetName;
                            }
                        }
                    }).result;
                    page2.then(function () {
                        NetSubnet.checkForDel(subnet).then(function (data) {
                            NetSubnet.delete(subnet).then(function () {
                                toast.success("删除子网成功");
                                NetPrivate.querySubnetByNetId($stateParams.netId).then(function (data) {
                                    vm.subList = data;
                                });
                            }, function (message) {
                                eayunModal.warning(message);
                            });
                        }, function (message) {
                            eayunModal.warning(message);
                        });
                    });
                });
            };
            /*将名称变为可编辑状态*/
            vm.editName = function (){
                vm.netNameEditable = true;
                vm.hintNameShow = true;
                vm.checkNetNameFlag = true;
                vm.editNet = angular.copy(vm.net, {});
            };
            /*校验编辑名称是否存在*/
            vm.checkName = function () {
                NetPrivate.checkName(vm.net.prjId, vm.editNet.netName, vm.net.netId).then(function (data) {
                    vm.checkNetNameFlag = data;
                });
            };
            /*取消名称、描述的可编辑状态*/
            vm.cancelEdit = function () {
                    vm.netNameEditable = false;
                    vm.hintNameShow = false;
            };
            /*保存编辑的名称,并刷新界面*/
            vm.saveEdit = function () {
                NetPrivate.edit(vm.editNet).then(function (data) {
                    vm.net = angular.copy(vm.editNet, {});
                    toast.success("修改网络" + (vm.net.netName.length > 10 ? vm.net.netName.substring(0, 7) + '...' : vm.net.netName) + "成功");
                    vm.netNameEditable = false;
                    vm.hintNameShow = false;
                }, function (message) {
                    eayunModal.error(message);
                });
            };
            /**
             * 网络状态 显示
             */
            vm.getNetStatus = function (model) {
                vm.vmStatusClass = '';
                if (model.netStatus && model.netStatus == 'ACTIVE' && model.chargeState == '0') {
                    vm.vmStatusClass = 'green';
                } else if (model.netStatus && model.netStatus != 'ACTIVE' && model.chargeState == '0') {
                    vm.vmStatusClass = 'yellow';
                } else if (model.chargeState != '0') {
                    vm.vmStatusClass = 'gray';
                }
            };
        }]);