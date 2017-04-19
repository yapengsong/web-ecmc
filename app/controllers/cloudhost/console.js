/**
 * Created by eayun on 2016/4/26.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('CloudhostHostConsoleCtrl', ['vmModel', 'HostService', '$sce', '$modalInstance', function (vmModel, HostService, $sce, $modalInstance) {
        var vm = this;

        HostService.consoleVm(vmModel).then(function (data) {
            vm.consoleUrl = $sce.trustAsResourceUrl(data);
        });

        vm.cancel = function () {
            $modalInstance.close(true);
        };
    }]);