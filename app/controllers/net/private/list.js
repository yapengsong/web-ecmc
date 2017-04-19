/**
 * Created by ZHL on 2016/4/7.
 */
'use strict';

angular.module('eayun.net')
    .controller('NetPrivateListCtrl', ['NetPrivate', 'HomeCommonService', 'eayunModal', 'NetRouter', 'toast','NetExternal',
        function (NetPrivate, HomeCommonService, eayunModal, NetRouter, toast, NetExternal) {
            var vm = this;
            vm.table = {
                api: {},
                source: '/api/ecmc/virtual/network/querynetwork',
                getParams: function () {
                    var param = {};
                    param[vm.search.key] = vm.search.value;
                    param.dcId = vm.dcId;
                    return param;
                }
            };
            vm.search = '';
            vm.options = {
                searchFn: function () {
                    vm.table.api.draw();
                },
                select: [{netName: '名称'}, {cusOrg: '客户'}, {prjName: '项目'}],
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
            HomeCommonService.getDcList().then(function (data) {
                vm.dcList = data;
            });
            vm.dcChange = function () {
                vm.table.api.draw();
            };
            vm.add = function () {
                var result = eayunModal.dialog({
                    title: '创建私有网络',
                    width: '800px',
                    showBtn: false,
                    templateUrl: 'controllers/net/private/edit.html',
                    controller: 'NetPrivateSaveCtrl',
                    controllerAs: 'edit',
                    resolve: {
                        net: {}
                    }
                });
                result.then(function () {
                    vm.table.api.draw();
                });
            };
            vm.edit = function (net) {
                var result = eayunModal.dialog({
                    title: '编辑私有网络',
                    width: '800px',
                    showBtn: false,
                    templateUrl: 'controllers/net/private/edit.html',
                    controller: 'NetPrivateSaveCtrl',
                    controllerAs: 'edit',
                    resolve: {
                        net: function(){
                            return net;
                        }
                    }
                });
                result.then(function () {
                    vm.table.api.draw();
                });
            };
            vm.delete = function (net) {
                var page1 = eayunModal.open({
                    templateUrl: 'controllers/net/deleteone.html',
                    controller: 'DeleteResourceInfo1',
                    controllerAs: 'delRes1',
                    resolve: {
                        name: function () {
                            return net.netName;
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
                                return net.netName;
                            }
                        }
                    }).result;
                    page2.then(function () {
                        NetPrivate.checkDelete(net.netId)
                            .then(function () {
                                NetPrivate.delete(net).then(function () {
                                    vm.table.api.draw();
                                    toast.success("删除网络成功");
                                });
                            }, function (message) {
                                eayunModal.warning(message);
                            })
                    });
                });
            };
            vm.setGateway = function (net) {
                if(net.routeId == null || net.chargeState != '0'){
                    return ;
                }
                eayunModal.confirm('确定要设置' + net.netName + '的网关？').then(function () {
                    NetExternal.getSelectList(net.dcId).then(function (response) {
                        var outNetList = angular.copy(response.data, []);
                        if (outNetList && outNetList.length == 1) {
                            var outNet = outNetList[0];
                            var router = {'routeId':net.routeId,'netId':outNet.netId,'dcId':net.dcId,'prjId':net.prjId,'routeName':net.routeName};
                            NetRouter.setGateway(router).then(function (response) {
                                toast.success('设置网关成功');
                                vm.table.api.draw();
                            }, function () {
                            });
                        } else {
                            eayunModal.warning('当前有多个外网，需要指定！');
                        }
                    });
                }, function () {

                });
                /*var result = eayunModal.dialog({
                    title: '设置网关',
                    width: '800px',
                    templateUrl: 'controllers/net/private/gateWay.html',
                    controller: 'NetPrivateGatewayCtrl',
                    controllerAs: 'gateway',
                    resolve: {
                        routerId: function () {
                            return net.routeId;
                        }
                    }
                });
                result.then(function () {
                    vm.table.api.draw();
                    toast.success("设置网关成功");
                });*/
            };
            vm.clearGateway = function (net) {
                if(net.routeId == null || net.chargeState != '0'){
                    return ;
                }
                eayunModal.confirm('确定要清除' + net.netName + '的网关？').then(function () {
                    NetPrivate.checkClearNet(net.routeId).then(function () {
                        NetRouter.clearGateway(net.routeId, net.routeName, net.dcId, net.prjId).then(function (data) {
                            vm.table.api.draw();
                            toast.success("清除网关成功");
                        }, function (message) {
                            eayunModal.warning(message)
                        });
                    },function (message) {
                        eayunModal.warning(message);
                    });
                });
            };
            vm.addSubnet = function (net) {
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
                                prjId: net.prjId,
                                dcId: net.dcId,
                                networkId: net.netId
                            };
                        }
                    }
                });
                result.then(function (data) {
                    vm.table.api.draw();
                });
            };
            /**
             * 网络状态 显示
             */
            vm.getNetStatus = function (model, _index) {
                vm.netStatusClass[_index] = '';
                if (model.netStatus && model.netStatus == 'ACTIVE' && model.chargeState == '0') {
                    return 'green';
                } else if (model.netStatus && model.netStatus != 'ACTIVE' && model.chargeState == '0') {
                    return 'yellow';
                } else if (model.chargeState != '0') {
                    return 'gray';
                }
            };
        }]);