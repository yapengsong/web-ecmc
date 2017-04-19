/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.net')
    .controller('NetPrivateSaveCtrl', ['$scope', 'net', 'HomeCommonService', 'eayunModal', 'NetPrivate', 'toast', 'utils',
        function ($scope, _net, HomeCommonService, eayunModal, NetPrivate, toast, utils) {
            var vm = this;
            vm.net = angular.copy(_net, {});
            HomeCommonService.getDcList().then(function (data) {
                vm.dcList = data;
            });
            if (vm.net.dcId) {
                HomeCommonService.getPrjByDcId(_net.dcId).then(function (data) {
                    vm.prjList = data;
                    vm.net.prjId = _net.prjId;
                    HomeCommonService.getPrjQuotaById(_net.prjId).then(function (data) {
                        vm.quota = data;
                        vm.quota.countBandUse = vm.quota.countBandUse - _net.rate;
                    });
                });
            }
            vm.dcChange = function () {
                vm.net.prjId = null;
                HomeCommonService.getPrjByDcId(vm.net.dcId).then(function (data) {
                    vm.prjList = data;
                });
            };
            vm.prjChange = function () {
                if (vm.net.prjId) {
                    HomeCommonService.getPrjQuotaById(vm.net.prjId).then(function (data) {
                        vm.quota = data;
                    });
                    $scope.editNet.name.$validate();
                } else {
                    vm.quota = {};
                }
            };
            vm.checkName = function (value) {
                if (vm.net.prjId) {
                    return NetPrivate.checkName(vm.net.prjId, value, vm.net.netId);
                } else {
                    return true;
                }
            };
            $scope.commit = function () {
                if (vm.net.netId) {
                    NetPrivate.edit(vm.net).then(function (data) {
                        $scope.ok(data);
                        toast.success("修改网络" + utils.ellipsis(vm.net.netName, 10) + "成功");
                    }, function (message) {
                        eayunModal.error(message);
                    });
                } else {
                    NetPrivate.add(vm.net).then(function (data) {
                        $scope.ok(data);
                        toast.success("网络" + utils.ellipsis(vm.net.netName, 10) + "创建成功");
                    }, function (message) {
                        eayunModal.error(message);
                    });
                }

            };
        }]);