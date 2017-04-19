/**
 * Created by ZHL on 2016/4/7.
 */
'use strict';

angular.module('eayun.net')
    .controller('NetPrivateRouterCtrl', ['HomeCommonService', 'eayunModal', 'NetRouter', 'toast','NetExternal',
        function (HomeCommonService, eayunModal, NetRouter, toast, NetExternal) {
            var vm = this;
            vm.search = '';
            vm.options = {
                searchFn: function () {
                    vm.table.api.draw();
                },
                select: [{name: '名称'}, {cusOrg: '客户'}, {prjName: '项目'}],
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
                source: '/api/ecmc/virtual/route/queryroute',
                getParams: function () {
                    var param = {};
                    param[vm.search.key] = vm.search.value;
                    param.datacenterId = vm.dcId;
                    return param;
                }
            };

            HomeCommonService.getDcList().then(function (data) {
                vm.dcList = data;
            });

            vm.add = function () {
                var result = eayunModal.dialog({
                    title: '创建路由',
                    width: '800px',
                    showBtn: false,
                    templateUrl: 'controllers/net/private/editRoute.html',
                    controller: 'NetPrivateRouteSaveCtrl',
                    controllerAs: 'route',
                    resolve: {
                        route: {}
                    }
                });
                result.then(function () {
                    vm.table.api.draw();
                });
            };
            vm.edit = function (_route) {
                var result = eayunModal.dialog({
                    title: '编辑路由',
                    width: '800px',
                    showBtn: false,
                    templateUrl: 'controllers/net/private/editRoute.html',
                    controller: 'NetPrivateRouteSaveCtrl',
                    controllerAs: 'route',
                    resolve: {
                        route: _route
                    }
                });
                result.then(function () {
                    vm.table.api.draw();
                });
            };
            vm.connectNet = function (_router) {
                if(_router.chargeState != '0'){
                    return ;
                }
                var result = eayunModal.dialog({
                    title: '连接子网',
                    width: '800px',
                    templateUrl: 'controllers/net/private/connectNet.html',
                    controller: 'NetPrivateRouterConnectCtrl',
                    controllerAs: 'connect',
                    resolve: {
                        router: _router
                    }
                });
                result.then(function () {
                    vm.table.api.draw();
                });
            };
            vm.setGateway = function (router) {
                eayunModal.confirm('确定要设置' + router.routeName + '的网关？').then(function () {
                    NetExternal.getSelectList(router.dcId).then(function (response) {
                        var outNetList = angular.copy(response.data, []);
                        if (outNetList && outNetList.length == 1) {
                            var outNet = outNetList[0];
                            var router_ = {'routeId':router.routeId,'netId':outNet.netId,'dcId':router.dcId,'prjId':router.prjId,'routeName':router.routeName};
                            NetRouter.setGateway(router_).then(function (response) {
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
                            return router.routeId;
                        }
                    }
                });
                result.then(function () {
                    vm.table.api.draw();
                    toast.success("设置网关成功");
                });*/
            };
            vm.clearGateway = function (router) {
                eayunModal.confirm('确定要清除' + router.routeName + '的网关？').then(function () {
                    NetRouter.checkClearNet(router.routeId).then(function () {
                        NetRouter.clearGateway(router.routeId, router.routeName, router.dcId, router.prjId).then(function (data) {
                            vm.table.api.draw();
                            toast.success("清除网关成功");
                        }, function (message) {
                            eayunModal.warning(message);
                        });
                    }, function (message) {
                        eayunModal.warning(message);
                    });

                });
            };
            vm.delete = function (router) {
                var page1 = eayunModal.open({
                    templateUrl: 'controllers/net/deleteone.html',
                    controller: 'DeleteResourceInfo1',
                    controllerAs: 'delRes1',
                    resolve: {
                        name: function () {
                            return router.routeName;
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
                                return router.routeName;
                            }
                        }
                    }).result;
                    page2.then(function () {
                        NetRouter.delete(router).then(function () {
                            toast.success("删除路由成功");
                            vm.table.api.draw();
                        },function (message) {
                            eayunModal.warning(message);
                        });
                    });
                });
                /*eayunModal.confirm("删除资源" + router.routeName + "有可能造成客户线上环境和财务损失，请确认与客户进行过沟通。").then(function () {
                    eayunModal.confirm("资源" + router.routeName + "删除后将无法恢复，请谨慎操作。确认删除？").then(function () {
                        NetRouter.delete(router).then(function () {
                            toast.success("删除路由成功");
                            vm.table.api.draw();
                        },function (message) {
                            eayunModal.warning(message);
                        });
                    });
                });*/
            };
            vm.getRouteStatus = function (model, _index){
                vm.routeStatusClass[_index] = '';
                if(model.chargeState != '0'){
                    return 'gray';
                }
                else if (model.routeStatus && model.routeStatus == 'ACTIVE' && model.chargeState == '0') {
                    return 'green';
                }
            };
        }]);