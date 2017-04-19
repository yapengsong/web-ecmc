/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.net')
    .controller('NetPrivateRouteSaveCtrl', ['$scope', 'route', 'eayunModal', 'HomeCommonService', 'NetPrivate', 'NetRouter', 'toast', 'utils',
        function ($scope, _route, eayunModal, HomeCommonService, NetPrivate, NetRouter, toast, utils) {
            var vm = this;
            vm.route = angular.copy(_route, {});
            HomeCommonService.getDcList().then(function (data) {
                vm.dcList = data;
            });
            if (vm.route.dcId) {
                HomeCommonService.getPrjByDcId(vm.route.dcId).then(function (data) {
                    vm.prjList = data;
                    vm.route.prjId = _route.prjId;
                    HomeCommonService.getPrjQuotaById(vm.route.prjId).then(function (data) {
                        vm.quota = data;
                        vm.quota.countBandUse = vm.quota.countBandUse - _route.rate;
                        vm.netList = [{netId: _route.netWorkId, netName: _route.networkName}];
                    });
                });
            }
            vm.dcChange = function () {
                vm.route.prjId = null;
                vm.prjList = [];
                vm.quota = {};
                vm.route.netWorkId = _route.routeId ? _route.netWorkId : null;
                vm.netList = [];
                HomeCommonService.getPrjByDcId(vm.route.dcId).then(function (data) {
                    vm.prjList = data;
                });
            };
            vm.prjChange = function () {
                vm.quota = {};
                vm.route.netWorkId = _route.routeId ? _route.netWorkId : null;
                vm.netList = [];
                if (vm.route.prjId) {
                    HomeCommonService.getPrjQuotaById(vm.route.prjId).then(function (data) {
                        vm.quota = data;
                    });
                    NetPrivate.queryNotBindRouteNetwork(vm.route.prjId).then(function (data) {
                        vm.netList = data;
                    });
                    $scope.editNet.name.$validate();
                }
            };
            vm.checkName = function (value) {
                return NetRouter.checkName(vm.route.dcId, vm.route.prjId, value, vm.route.routeId);
            };

            $scope.commit = function () {
                if (vm.route.routeId) {
                    NetRouter.edit(vm.route).then(function (data) {
                        $scope.ok(data);
                        toast.success("修改路由" + utils.ellipsis(vm.route.routeName, 10) + "成功");
                    }, function (message) {
                        eayunModal.warning(message);
                    });
                } else {
                    NetRouter.add(vm.route).then(function (data) {
                        $scope.ok(data);
                        toast.success("添加路由" + utils.ellipsis(vm.route.routeName, 10) + "成功");
                    }, function (message) {
                        eayunModal.warning(message);
                    });
                }
            };
        }]);