/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.net')
    .controller('NetPrivateGatewayCtrl', ['$scope', 'routerId', 'NetRouter', 'NetExternal', 'eayunModal',
        function ($scope, routerId, NetRouter, NetExternal, eayunModal) {
            var vm = this;
            vm.router = {netId: ''};
            NetRouter.getById(routerId)
                .then(function (data) {
                    vm.router = data;
                    return data;
                })
                .then(function (data) {
                    return NetExternal.getSelectList(data.dcId).then(function (data) {
                        vm.selectList = data.data;
                    })
                });
            $scope.commit = function () {
                NetRouter.setGateway(vm.router).then(function (data) {
                    $scope.ok(data);
                }, function (message) {
                    eayunModal.warning(message);
                });
            };
        }]);