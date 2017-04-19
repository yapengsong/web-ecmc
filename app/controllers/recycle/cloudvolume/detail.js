/**
 * Created by zhouhaitao on 2016/8/29.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('RecycleVolumeDetailCtrl', ['$stateParams','vmModel', 'eayunModal','SysCode', 'toast', function ($stateParams,vmModel, eayunModal,SysCode, toast) {
        var vm = this;
        vm.vmModel = vmModel;

        /*云硬盘中点击云硬盘名称*/
        vm.getVolStatusClass = function () {
                if(vmModel.isDeleted == '2' && vmModel.volStatus != 'DELETING') {
                     vm.volStatusClass =  'red';
                }else{
                     vm.volStatusClass =  'yellow';
                }
        };

        vm.getVolStatusClass();

        //状态颜色
        vm.getVolStatusClass1 = function () {
            if(vmModel.chargeState != '0') {
                vm.volStatusClass1 = 'gray';
                return ;
            }
            if (vmModel.volStatus == 'IN-USE') {
                vm.volStatusClass1 = 'green';
            }
            else if (vmModel.volStatus == 'AVAILABLE') {
                vm.volStatusClass1 = 'space';
            }
            else if (vmModel.volStatus == 'ERROR') {
                vm.volStatusClass1 = 'gray';
            }
            else if (vmModel.volStatus == 'CREATING' || vmModel.volStatus == 'DOWNLOADING' || vmModel.volStatus == 'ATTACHING' || vmModel.volStatus == 'DETACHING' || vmModel.volStatus == 'DELETING') {
                vm.volStatusClass1 = 'yellow';
            }
            else {
                vm.volStatusClass1 = 'red';
            }
        };

        vm.getVolStatusClass1();
    }]);