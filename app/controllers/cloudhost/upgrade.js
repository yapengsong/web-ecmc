/**
 * Created by eayun on 2016/4/26.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('CloudhostHostUpgradeCtrl', ['vmModel', 'project', 'HostService', '$scope', 'eayunModal', function (vmModel, project, HostService, $scope, eayunModal) {
        var vm = this;
        vm.project = project;
        vm.vmModel = angular.copy(vmModel, {});
        vm.vmOrigin = vmModel;

        HostService.getCpuList().then(function (data) {
            vm.cpuList = data;
        });

        vm.changeCpu = function () {
            vm.vmModel.cpus = vm.cpus.nodeName.substr(0, vm.cpus.nodeName.length - 1);
            vm.rams = {};
            HostService.getRamListByCpu(vm.cpus.nodeId).then(function (data) {
                vm.ramList = data;
            });
        };

        vm.changeRam = function () {
            vm.vmModel.rams = vm.rams.nodeName.substr(0, vm.rams.nodeName.length - 2);
        };

        vm.commit = function () {
            eayunModal.confirm('确定要升级主机的配置为' + vm.cpus.nodeName + vm.rams.nodeName + '？').then(function () {
                $scope.ok(vm.vmModel);
            });
        };
    }]);