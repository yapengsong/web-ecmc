/**
 * Created by eayun on 2016/4/25.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('CloudhostHostLogCtrl', ['vmModel', 'HostService', '$scope', function (vmModel, HostService, $scope) {
        var vm = this;

        vm.vmModel = vmModel;

        HostService.getVmLog(vmModel).then(function (message) {
            vm.logInfo = message;
        }, function () {

        });
    }]);