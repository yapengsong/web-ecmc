/**
 * Created by ZHL on 2016/4/7.
 */
'use strict';

angular.module('eayun.net')
    .controller('NetExternalListCtrl', ['$state', 'eayunModal', 'NetExternal', 'toast', 'SysCode', 'HomeCommonService','utils',
        function ($state, eayunModal, NetExternal, toast, SysCode, HomeCommonService,utils) {
            var vm = this;
            HomeCommonService.getDcList().then(function (data) {
                vm.dcList = data;
            });
            vm.search = '';
            vm.options = {
                placeholder: "请输入外部网络名称搜索",
                searchFn: function () {
                    vm.table.api.draw();
                }
            };

            vm.table = {
                api: {},
                source: '/api/ecmc/virtual/networkout/queryoutnetwork',
                getParams: function () {
                    return {
                        netName: vm.search,
                        dcId: vm.dcId
                    };
                }
            };

            vm.detail = function (_netId) {
                $state.go('app.net.externalDetail', {netId: _netId});
            };

            vm.add = function (_net) {
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '创建外部网络子网',
                    width: '800px',
                    templateUrl: 'controllers/net/external/add/add.html',
                    controller: 'NetExternalAddSubnetCtrl',
                    controllerAs: 'subnetAdd',
                    resolve: {
                        netId: function () {
                            return _net.netId;
                        },
                        prjId: function () {
                            return _net.prjId;
                        },
                        dcId: function () {
                            return _net.dcId;
                        }
                    }
                });
                result.then(function () {
                    vm.table.api.draw();
                });
            };

            vm.editOutNet = function (_netModel) {
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '编辑外部网络',
                    width: '800px',
                    templateUrl: 'controllers/net/external/editOutNet.html',
                    controller: 'NetExternalEditNetCtrl',
                    controllerAs: 'netEdit',
                    resolve: {
                        netModel: function () {
                            return _netModel;
                        }
                    }
                });
                result.then(function (resultData) {
                    NetExternal.editOutNet(resultData).then(function (response) {
                        switch (response.respCode) {
                            case SysCode.success:
                                toast.success("编辑外部网络" + utils.ellipsis(response.data.netName, 7) + "成功");
                                vm.table.api.draw();
                                return;
                            case SysCode.error:
                                eayunModal.error("编辑外部网络" + resultData.netName+ "失败");
                                return;
                        }
                    }, function (response) {

                    });
                });
            };
        }]);