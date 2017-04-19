/**
 * Created by ZHL on 2016/4/7.
 */
'use strict';

angular.module('eayun.net')
    .controller('NetPrivateRouterDetailCtrl', ['$stateParams', 'NetRouter', 'eayunModal', 'toast','baseInfo','utils',
        function ($stateParams, NetRouter, eayunModal, toast, baseInfo, utils) {
            var vm = this;
            vm.gatewayIp = baseInfo.gatewayIp;
            NetRouter.getById($stateParams.routerId)
                .then(function (data) {
                    vm.router = data;
                    vm.getRouteStatus(vm.router);
                    return data;
                });
                   /* .then(function (router) {
                        NetRouter.querySubnetByRouterId(router.routeId, router.dcId).then(function (data) {
                            vm.subList = data;
                        });
                    });*/
            /*NetRouter.queryPMByRouterId($stateParams.routerId,$stateParams.dcId,$stateParams.prjId).then(function (data) {
             vm.pmList = data;
             });*/
            // TODO 获取端口映射列表
            vm.pmtable = {
                api: {},
                source: '/api/ecmc/cloud/netWork/portmapping/list',
                getParams: function () {
                    return {
                        routeId : baseInfo.routeId,
                        dcId : baseInfo.dcId,
                        prjId : baseInfo.prjId
                    };
                }
            };
            //TODO 获取私有网络下的受管子网
            vm.subtable = {
                api: {},
                source: '/api/ecmc/virtual/route/queryroutesubnetwork',
                getParams: function () {
                    return {
                        routeId : baseInfo.routeId,
                        dcId : baseInfo.dcId
                    };
                }
            };
            vm.connectNet = function () {
                var result = eayunModal.dialog({
                    title: '连接子网',
                    width: '800px',
                    templateUrl: 'controllers/net/private/connectNet.html',
                    controller: 'NetPrivateRouterConnectCtrl',
                    controllerAs: 'connect',
                    resolve: {
                        router: vm.router
                    }
                });
                result.then(function () {
                    NetRouter.querySubnetByRouterId(vm.router.routeId, vm.router.dcId).then(function (data) {
                        vm.subList = data;
                    });
                });
            };
            vm.detachSubnet = function (subnet) {
                eayunModal.confirm('确定要断开子网' + subnet.subnetName + '同路由的连接？')
                    .then(function () {
                        NetRouter.checkDetachSubnet(subnet.subnetId).then(function (data) {
                             NetRouter.detachSubnet(subnet, vm.router)
                                 .then(function () {
                                     //解绑子网成功以后，路由详情中的子网数量需要减1
                                     vm.router.connectsubnetnum = parseInt(vm.router.connectsubnetnum) - 1;
                                     toast.success("解绑路由成功");
                                     vm.subtable.api.draw();
                                 })
                        },function (message) {
                            eayunModal.warning(message);
                        });
                    });
            };
            vm.attachSubnet = function (subnet) {
                eayunModal.confirm("确定绑定路由?")
                    .then(function () {
                        return NetRouter.attachSubnet(vm.router, subnet.subnetId);
                    })
                    .then(function () {
                        //绑定子网成功以后，路由详情中的子网数量需要加1
                        vm.router.connectsubnetnum = parseInt(vm.router.connectsubnetnum) + 1;
                        toast.success("绑定路由成功");
                        vm.subtable.api.draw();
                    });
            };
            vm.addPM = function () {
                if(vm.router.netId == null
                    || vm.router.netId == ''
                    || vm.router.netId == 'null'
                    || angular.isUndefined(vm.router.netId)){
                    eayunModal.warning('请先为私有网络设置网关！');
                    return ;
                }
                eayunModal.dialog({
                    title: '创建端口映射',
                    templateUrl: 'controllers/net/private/pmAdd.html',
                    controller: 'AddPortMappingCtrl',
                    controllerAs: 'addPM',
                    showBtn: false,
                    width: '600px',
                    resolve: {
                        dcId: function () {
                            return baseInfo.dcId;
                        },
                        prjId: function () {
                            return baseInfo.prjId;
                        },
                        routeId: function () {
                            return baseInfo.routeId;
                        },
                        gatewayIp: function () {
                            return vm.router.gatewayIp;
                        }
                    }
                }).then(function (portMapping) {
                    NetRouter.addPortMapping(portMapping).then(function (response) {
                        toast.success('创建端口映射服务成功！');
                        vm.pmtable.api.draw();
                    });
                });
            };

            vm.editPM = function (_portMapping) {
                eayunModal.dialog({
                    title: '编辑端口映射',
                    templateUrl: 'controllers/net/private/pmEdit.html',
                    controller: 'EditPortMappingCtrl',
                    controllerAs: 'editPM',
                    showBtn: false,
                    width: '600px',
                    resolve: {
                        dcId: function () {
                            return baseInfo.dcId;
                        },
                        prjId: function () {
                            return baseInfo.prjId;
                        },
                        portMapping: function () {
                            return _portMapping;
                        }
                    }
                }).then(function(portMapping){
                    NetRouter.updatePortMapping(portMapping).then(function(response){
                        toast.success('编辑端口映射服务成功！');
                        vm.pmtable.api.draw();
                    });
                });
            };

            vm.deletePM = function (_portMapping) {
                eayunModal.confirm('确定删除端口映射服务吗？').then(function () {
                    NetRouter.deletePortMapping(baseInfo.dcId, baseInfo.prjId, _portMapping).then(function (response) {
                        toast.success('删除端口映射服务成功！');
                        vm.pmtable.api.draw();
                    });
                });
            };
            vm.editName = function () {
                vm.routeNameEditable = true;
                vm.hintNameShow = true;
                vm.checkRouteNameFlag = true;
                vm.editRouter = angular.copy(vm.router, {});
            };
            vm.checkName = function () {
                NetRouter.checkName(vm.router.dcId, vm.router.prjId, vm.editRouter.routeName, vm.router.routeId).then(function(data) {
                    vm.checkRouteNameFlag = data;
                });
            };
            vm.cancelEdit = function () {
                vm.routeNameEditable = false;
                vm.hintNameShow = false;
            };
            vm.saveEdit = function () {
                NetRouter.edit(vm.editRouter).then(function (data) {
                    vm.router = angular.copy(vm.editRouter, {});
                    vm.routeNameEditable = false;
                    vm.hintNameShow = false;
                    toast.success("修改路由" + utils.ellipsis(vm.router.routeName, 10) + "成功");
                }, function (message) {
                    eayunModal.warning(message);
                });
            };
            /**
             * 网络状态 显示
             */
            vm.getRouteStatus = function (model) {
                vm.routeStatusClass = '';
                if(model.chargeState != '0'){
                    vm.routeStatusClass = 'gray';
                    return ;
                }
                else if (model.routeStatus && model.routeStatus == 'ACTIVE' && model.chargeState == '0') {
                    vm.routeStatusClass = 'green';
                    return ;
                }
            };
        }]);