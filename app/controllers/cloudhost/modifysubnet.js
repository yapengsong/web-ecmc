/**
 * Created by zhouhaitao on 2016/8/25.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('CloudhostModifySubnetCtrl', ['vmModel', 'HostService', '$scope', 'eayunModal','toast','SysCode',
        function (vmModel, HostService, $scope, eayunModal,toast,SysCode) {
        var vm = this;
        vm.vmModel = angular.copy(vmModel, {});
        if(vm.vmModel.subnetId == 'null'){
            vm.vmModel.subnetId  = '-1';
        }
        if(vm.vmModel.selfSubnetId == 'null'){
            vm.vmModel.selfSubnetId  = '-1';
        }
        vm.vmOrigin = vmModel;

        var params ={};
        params.netId = vmModel.netId;
        params.subnetType = '1';

        HostService.getSubnetList(params).then(function (data) {
            vm.subnetList = data;
        });

        var paramself ={};
        paramself.subnetType = '0';
        paramself.netId = vmModel.netId;
        HostService.getSubnetList(paramself).then(function (data) {
            vm.selfSubnetList = data;
        });

         vm.substrSubnetName =function (text){
             var testSubstr = text;
             if(text.indexOf('(')!=-1){
                 var perText = text.substr(0,text.indexOf('('));
                 if(perText.length>8){
                     perText = perText.substr(0,8)+"...";
                 }
                 testSubstr = perText + text.substr(text.indexOf('('),text.length-1);
             }
             return testSubstr;
         };

        vm.changeSubnet = function () {
            var paramData = {
                'vmId':vm.vmModel.vmId,
                'vmIp':vm.vmModel.vmIp,
                'subnetId':vm.vmModel.subnetId,
                'netId':vm.vmModel.netId
            };
            HostService.changeSubnet(paramData).then(function (data) {
                vm.canChangeVmIpFlag = data;
            });
        };


        vm.commit = function () {
            vm.checkBtn = true;
            var paramData = {};
            paramData.dcId = vm.vmModel.dcId;
            paramData.prjId = vm.vmModel.prjId;
            paramData.netId = vm.vmModel.netId;
            paramData.subnetId = vm.vmModel.subnetId == '-1'?'':vm.vmModel.subnetId;
            paramData.selfSubnetId = vm.vmModel.selfSubnetId == '-1'?'':vm.vmModel.selfSubnetId;
            paramData.vmId = vm.vmModel.vmId;
            paramData.vmName = vm.vmModel.vmName;

            HostService.modifySubnet(paramData).then(function (response) {
                if (response.respCode == SysCode.success) {
                    toast.success('修改子网成功');
                    $scope.ok(vm.vmModel);
                } else {
                    console.log(response.message);
                    eayunModal.error(response.message);
                    $scope.cancel();
                    vm.checkBtn = false;
                }
            });

        };
    }]);