/**
 * Created by eayun on 2016/4/25.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('CloudhostHostSecurityGroupCtrl', ['vmModel', 'HostService', '$scope', function (vmModel, HostService, $scope) {
        var vm = this;

        vm.vmModel = vmModel;

        HostService.getSecurityListUnselected(vm.vmModel.vmId, vm.vmModel.prjId).then(function (data) {
            vm.securityListUnselected = data;
        });

        HostService.getSecurityListSelected(vm.vmModel.vmId, vm.vmModel.prjId).then(function (data) {
            vm.securityListSelected = data;
        });

        vm.addItemToSecurityList = function (_item, _index) {
            vm.securityListSelected.push(_item);
            vm.securityListUnselected.splice(_index, 1);
        };

        vm.deleteFromSecurityList = function (_item, _index) {
            vm.securityListSelected.splice(_index, 1);
            vm.securityListUnselected.push(_item);
        };

        vm.commit = function () {
            vm.vmModel.bcsgs = vm.securityListSelected;
            $scope.ok(vm.vmModel);
        };
    }]);