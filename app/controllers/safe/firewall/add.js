/**
 * Created by eayun on 2016/4/18.
 */
'use strict'

angular.module('eayun.safe')
    .controller('SafeFirewallListAddCtrl', ['$scope', 'HomeCommonService', 'FwService', function ($scope, HomeCommonService, FwService) {
        var vm = this;
        vm.fwNameIsExist = false;
        vm.sourcePortIsExist = true;
        vm.destinationPortIsExist = true;
        vm.fwModel = {};
        vm.fwPolicyList ={};

        FwService.getDcResourceList().then(function (response) {
            vm.allDcResourceList = response;
        });

        vm.getProjectListByDcId = function (_dcId) {
            vm.fwModel.prjId='';
            HomeCommonService.getPrjByDcId(_dcId).then(function (response) {
                vm.allProjectList = response;
            });

        };

        vm.changeDorPId = function (fwModel) {
            vm.fwModel.fwpId='';//切换项目清空策略
            FwService.getFwPolicyList(fwModel).then(function (data) {
                vm.fwPolicyList = data;
            });
            vm.checkFwRuleName();
            vm.checkFwName();
        };

        vm.checkFwName = function () {
            if(vm.fwModel.prjId ==undefined ||vm.fwModel.prjId ==''|| vm.fwModel.dcId ==undefined || vm.fwModel.fwName == undefined){
                vm.fwNameIsExist = false;
                return ;
            }
             FwService.checkFireWallName(vm.fwModel).then(function(response){
                 vm.fwNameIsExist = !response;
             });
        };

        $scope.commit = function () {
        	vm.fwModel.sourceIpaddress = vm.fwModel.sourceIpaddress1 + '.' + vm.fwModel.sourceIpaddress2 + '.' + vm.fwModel.sourceIpaddress3 + '.' + vm.fwModel.sourceIpaddress4 + '/' + vm.fwModel.sourceIpaddress5;
        	vm.fwModel.destinationIpaddress = vm.fwModel.destinationIpaddress1 + '.' + vm.fwModel.destinationIpaddress2 + '.' + vm.fwModel.destinationIpaddress3 + '.' + vm.fwModel.destinationIpaddress4 + '/' + vm.fwModel.destinationIpaddress5
        	var resultData = FwService.transferDataForCommitFPR(vm.fwModel);
            $scope.ok(resultData);
        };
        //防火墙规则--验证
        vm.fwRuleNameIsExist = false;
        vm.checkFwRuleName = function () {
            if (vm.fwModel.prjId == undefined || vm.fwModel.prjId == '' || vm.fwModel.dcId == undefined || vm.fwModel.fwrName == undefined) {
                vm.fwRuleNameIsExist = false;
                return;
            }

            FwService.checkFwrName(vm.fwModel).then(function(response){
                vm.fwRuleNameIsExist = !response;
            });
        };
        vm.selectICMP = function () {
        	if("icmp"==vm.fwModel.protocol || "any"==vm.fwModel.protocol){
        		vm.fwModel.sourcePort="";
        		vm.fwModel.destinationPort="";
        	}
        };

        vm.checkIp = function (_value, _flagName) {
            return FwService.checkIp(vm, _value, _flagName);
        };

        vm.checkPort = function (_value, _flagName) {
            return FwService.checkPort(vm, _value, _flagName);
        };
        vm.fwModel.sourceIpaddress1 = 0;
        vm.fwModel.sourceIpaddress2 = 0;
        vm.fwModel.sourceIpaddress3 = 0;
        vm.fwModel.sourceIpaddress4 = 0;
        vm.fwModel.sourceIpaddress5 = 0;
        
        vm.fwModel.destinationIpaddress1 = 0;
        vm.fwModel.destinationIpaddress2 = 0;
        vm.fwModel.destinationIpaddress3 = 0;
        vm.fwModel.destinationIpaddress4 = 0;
        vm.fwModel.destinationIpaddress5 = 0;

        var regx=/^(0|[1-9]\d*)$/;
		vm.sourrange = "0.0.0.0/0代表所有IP地址";
		vm.destrange = "0.0.0.0/0代表所有IP地址";
		vm.cidraError = true;
		vm.cidrbError = true;
		function checkCidr0_255(val,fromFunc,type) {
			if(fromFunc=="focus"){
				if(type=="a"){
					vm.sourrange="请输入0-255之间的整数！";
				}else{
					vm.destrange="请输入0-255之间的整数！";
				}
			}else{
				vm.sourrange = "0.0.0.0/0代表所有IP地址";
				vm.destrange = "0.0.0.0/0代表所有IP地址";
			}
			if (val >= 0 && val <= 255 && regx.test(val)) {
				return false;
			} else {
				return true;
			}
		};
		function checkCidr0_32(val,fromFunc,type) {
			if(fromFunc=="focus"){
				if(type=="a"){
					vm.sourrange="请输入0-32之间的整数！";
				}else{
					vm.destrange="请输入0-32之间的整数！";
				}
			}else{
				vm.sourrange = "0.0.0.0/0代表所有IP地址";
				vm.destrange = "0.0.0.0/0代表所有IP地址";
			}
			if (val >= 0 && val <= 32 && regx.test(val)) {
				return false;
			} else {
				return true;
			}
		};
		vm.checkTypeCidr = function(position,fromFunc) {
			if(position=='' ||position==null){
				vm.a1Error = false;
				vm.a2Error = false;
				vm.a3Error = false;
				vm.a4Error = false;
				vm.a5Error = false;
				vm.b1Error = false;
				vm.b2Error = false;
				vm.b3Error = false;
				vm.b4Error = false;
				vm.b5Error = false;
				vm.cidraError = false;
				vm.cidrbError = false;
				return ;
			}
			if(position=='a1'){
				vm.a1Error=checkCidr0_255(vm.fwModel.sourceIpaddress1,fromFunc,'a');
			}else if(position=='a2'){
				vm.a2Error=checkCidr0_255(vm.fwModel.sourceIpaddress2,fromFunc,'a');
			}else if(position=='a3'){
				vm.a3Error=checkCidr0_255(vm.fwModel.sourceIpaddress3,fromFunc,'a');
			}else if(position=='a4'){
				vm.a4Error=checkCidr0_255(vm.fwModel.sourceIpaddress4,fromFunc,'a');
			}else if(position=='a5'){
				vm.a5Error=checkCidr0_32(vm.fwModel.sourceIpaddress5,fromFunc,'a');
			}else if(position=='b1'){
				vm.b1Error=checkCidr0_255(vm.fwModel.destinationIpaddress1,fromFunc,'b');
			}else if(position=='b2'){
				vm.b2Error=checkCidr0_255(vm.fwModel.destinationIpaddress2,fromFunc,'b');
			}else if(position=='b3'){
				vm.b3Error=checkCidr0_255(vm.fwModel.destinationIpaddress3,fromFunc,'b');
			}else if(position=='b4'){
				vm.b4Error=checkCidr0_255(vm.fwModel.destinationIpaddress4,fromFunc,'b');
			}else if(position=='b5'){
				vm.b5Error=checkCidr0_32(vm.fwModel.destinationIpaddress5,fromFunc,'b');
			}
			if(!vm.a1Error && !vm.a2Error && !vm.a3Error && !vm.a4Error && !vm.a5Error){
				vm.fwModel.sourceIpaddress = parseInt(vm.fwModel.sourceIpaddress1) + "." + parseInt(vm.fwModel.sourceIpaddress2) + "." + parseInt(vm.fwModel.sourceIpaddress3) + "." + parseInt(vm.fwModel.sourceIpaddress4) + "/" + parseInt(vm.fwModel.sourceIpaddress5);
				vm.cidraError = true;
			}else{
				vm.cidraError = false;
			} 
			if(!vm.b1Error && !vm.b2Error && !vm.b3Error && !vm.b4Error && !vm.b5Error){
				vm.fwModel.destinationIpaddress = parseInt(vm.fwModel.destinationIpaddress1) + "." + parseInt(vm.fwModel.destinationIpaddress2) + "." + parseInt(vm.fwModel.destinationIpaddress3) + "." + parseInt(vm.fwModel.destinationIpaddress4) + "/" + parseInt(vm.fwModel.destinationIpaddress5);
				vm.cidrbError = true;
			}else{
				vm.cidrbError = false;
			}
		};
    }]);