/**
 * Created by eayun on 2016/4/26.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('CloudhostHostFloatIpCtrl', ['vmModel', 'HostService', '$scope', function (vmModel, HostService, $scope) {
        var vm = this;

        vm.floatIp = {};

        HostService.getUnbindFloatIp(vmModel.prjId).then(function (data) {
            vm.unbindFloatIp = data;
        }, function () {

        });

        vm.commit = function () {
            $scope.ok({
                dcId: vm.floatIp.dcId,
                prjId: vm.floatIp.prjId,
                floId: vm.floatIp.floId,
                floIp: vm.floatIp.floIp,
                netId: vm.floatIp.netId,
                vmIp:vmModel.vmIp,
                resourceId: vmModel.vmId,
                resourceType: 'vm'
            });
        };
    }]);