/**
 * Created by zhouhaitao on 2016/8/29.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('RecycleHostDetailCtrl', ['$stateParams','vmModel', 'eayunModal','SysCode', 'toast', function ($stateParams,vmModel, eayunModal,SysCode, toast) {
        var vm = this;
        vm.vmModel = vmModel;

        vm.getVmStatusClass = function () {
            if (vm.vmModel.vmStatus && vm.vmModel.vmStatus == 'SOFT_DELETED') {
                vm.vmStatusClass = 'red';
            }
            else {
                vm.vmStatusClass = 'yellow';
            }
        };

        vm.getVmStatusClass();

    }]);