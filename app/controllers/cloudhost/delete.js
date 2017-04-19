/**
 * Created by zhouhaitao on 2016/8/29.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('CloudhostDeleteVmCtrl', ['vmModel', 'HostService', '$sce', '$modalInstance','WarningService','eayunModal','toast','warningMsg','$state',
        function (vmModel, HostService, $sce, $modalInstance,WarningService,eayunModal,toast,warningMsg,$state) {
        var vm = this;
        vm.vmModel = angular.copy(vmModel);
        if(vm.vmModel.chargeState != '0'){
            vm.modifyAble = true;
            vm.vmModel.isRecycle = true;
        }

        vm.cancel = function () {
            $modalInstance.close(true);
        };

        vm.ok = function () {
            var data = {};
            vm.btnCheck = true;
            data.vmId = vm.vmModel.vmId;
            data.dcId = vm.vmModel.dcId;
            data.prjId = vm.vmModel.prjId;
            data.vmName = vm.vmModel.vmName;
            data.deleteType = '0';
            if(vm.vmModel.isRecycle){
                data.deleteType = '1';
                eayunModal.confirm('资源' + vm.vmModel.vmName + '删除后将无法恢复，请谨慎操作。确认删除？').then(function () {
                    HostService.deleteVm(data).then(function () {
                         WarningService.getUnhandledAlarmMsgCount(warningMsg);
                         toast.success('云主机删除中');
                        $state.go('app.cloudhost.tab.host');
                        vm.cancel();
                    },function(){
                         vm.cancel();
                     });
                    //vm.cancel();
                },function(){
                    vm.cancel();
                });
            }
            else{
                HostService.deleteVm(data).then(function () {
                    WarningService.getUnhandledAlarmMsgCount(warningMsg);
                    toast.success('云主机删除中');
                    vm.cancel();
                    $state.go('app.cloudhost.tab.host');
                },function(){
                    vm.cancel();
                });
            }


        };
    }]);