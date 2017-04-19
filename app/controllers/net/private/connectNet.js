/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.net')
    .controller('NetPrivateRouterConnectCtrl', ['$scope', 'router', 'eayunModal', 'NetPrivate', 'NetRouter', 'toast', 'utils',
        function ($scope, _router, eayunModal, NetPrivate, NetRouter, toast, utils) {
            var vm = this;
            vm.router = _router;
            NetRouter.canAttachSubnet(vm.router.dcId, vm.router.prjId, vm.router.netWorkId).then(function (data) {
                vm.subList = data;
            });
            $scope.commit = function () {
                NetRouter.attachSubnet(vm.router, vm.subnetId).then(function () {
                    toast.success("路由" + utils.ellipsis(vm.router.routeName,8) + "连接子网成功");
                    $scope.ok();
                }, function (message) {
                    eayunModal.warning(message);
                });
            };
        }]);