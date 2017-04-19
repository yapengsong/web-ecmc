/**
 * Created by eayun on 2016/4/15.
 */
'use strict'

angular.module('eayun.safe')
    .controller('SafeFirewallRuleAddCtrl', ['$scope', 'HomeCommonService', 'FwService', 'eayunModal', 'dcId', 'prjId', function ($scope, HomeCommonService, FwService, eayunModal,dcId,prjId) {
        var vm = this;

        vm.ruleModel = {};
        vm.fwRuleNameIsExist = false;
        
        vm.ruleModel.sourceIpaddress1 = 0;
        vm.ruleModel.sourceIpaddress2 = 0;
        vm.ruleModel.sourceIpaddress3 = 0;
        vm.ruleModel.sourceIpaddress4 = 0;
        vm.ruleModel.sourceIpaddress5 = 0;
        
        vm.ruleModel.destinationIpaddress1 = 0;
        vm.ruleModel.destinationIpaddress2 = 0;
        vm.ruleModel.destinationIpaddress3 = 0;
        vm.ruleModel.destinationIpaddress4 = 0;
        vm.ruleModel.destinationIpaddress5 = 0;
        
        FwService.getDcResourceList().then(function (response) {
            vm.allDcResourceList = response;
        });

        vm.getAllProjectListByDcId = function (_dcId) {
            if (_dcId) {
                HomeCommonService.getPrjByDcId(_dcId).then(function (response) {
                    vm.allProjectList = response;
                    vm.ruleModel.prjId = '';
                });
            }
        };

        vm.changePrj = function () {
            vm.checkFwRuleName();
        };

        vm.checkFwRuleName = function () {
        	vm.ruleModel.prjId = prjId;
        	vm.ruleModel.dcId = dcId;
            if (vm.ruleModel.prjId == undefined || vm.ruleModel.prjId == '' || vm.ruleModel.dcId == undefined || vm.ruleModel.fwrName == undefined) {
                vm.fwRuleNameIsExist = false;
                return;
            }

            FwService.checkFwrName(vm.ruleModel).then(function(response){
                vm.fwRuleNameIsExist = !response;
            });
        };

        vm.selectICMP = function () {
        	if("icmp"==vm.ruleModel.protocol || "any"==vm.ruleModel.protocol){
        		vm.ruleModel.sourcePort="";
        		vm.ruleModel.destinationPort="";
        	}
        };
        
        vm.checkIp = function (_value, _flagName) {
            return FwService.checkIp(vm, _value, _flagName);
        };

        vm.checkPort = function (_value, _flagName) {
            return FwService.checkPort(vm, _value, _flagName);
        };

        $scope.commit = function () {
            eayunModal.confirm('规则' + vm.ruleModel.fwrName + '已设置正确，立即添加？').then(function () {
            	vm.ruleModel.sourceIpaddress = vm.ruleModel.sourceIpaddress1 + '.' + vm.ruleModel.sourceIpaddress2 + '.' + vm.ruleModel.sourceIpaddress3 + '.' + vm.ruleModel.sourceIpaddress4 + '/' + vm.ruleModel.sourceIpaddress5;
            	vm.ruleModel.destinationIpaddress = vm.ruleModel.destinationIpaddress1 + '.' + vm.ruleModel.destinationIpaddress2 + '.' + vm.ruleModel.destinationIpaddress3 + '.' + vm.ruleModel.destinationIpaddress4 + '/' + vm.ruleModel.destinationIpaddress5
                var resultDate = FwService.transferDataForRuleCommit(vm.ruleModel);
                $scope.ok(resultDate);
            }, function () {
                //console.info('取消');
            });

        }

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
				vm.a1Error=checkCidr0_255(vm.ruleModel.sourceIpaddress1,fromFunc,'a');
			}else if(position=='a2'){
				vm.a2Error=checkCidr0_255(vm.ruleModel.sourceIpaddress2,fromFunc,'a');
			}else if(position=='a3'){
				vm.a3Error=checkCidr0_255(vm.ruleModel.sourceIpaddress3,fromFunc,'a');
			}else if(position=='a4'){
				vm.a4Error=checkCidr0_255(vm.ruleModel.sourceIpaddress4,fromFunc,'a');
			}else if(position=='a5'){
				vm.a5Error=checkCidr0_32(vm.ruleModel.sourceIpaddress5,fromFunc,'a');
			}else if(position=='b1'){
				vm.b1Error=checkCidr0_255(vm.ruleModel.destinationIpaddress1,fromFunc,'b');
			}else if(position=='b2'){
				vm.b2Error=checkCidr0_255(vm.ruleModel.destinationIpaddress2,fromFunc,'b');
			}else if(position=='b3'){
				vm.b3Error=checkCidr0_255(vm.ruleModel.destinationIpaddress3,fromFunc,'b');
			}else if(position=='b4'){
				vm.b4Error=checkCidr0_255(vm.ruleModel.destinationIpaddress4,fromFunc,'b');
			}else if(position=='b5'){
				vm.b5Error=checkCidr0_32(vm.ruleModel.destinationIpaddress5,fromFunc,'b');
			}
			if(!vm.a1Error && !vm.a2Error && !vm.a3Error && !vm.a4Error && !vm.a5Error){
				vm.ruleModel.sourceIpaddress = parseInt(vm.ruleModel.sourceIpaddress1) + "." + parseInt(vm.ruleModel.sourceIpaddress2) + "." + parseInt(vm.ruleModel.sourceIpaddress3) + "." + parseInt(vm.ruleModel.sourceIpaddress4) + "/" + parseInt(vm.ruleModel.sourceIpaddress5);
				vm.cidraError = true;
			}else{
				vm.cidraError = false;
			} 
			if(!vm.b1Error && !vm.b2Error && !vm.b3Error && !vm.b4Error && !vm.b5Error){
				vm.ruleModel.destinationIpaddress = parseInt(vm.ruleModel.destinationIpaddress1) + "." + parseInt(vm.ruleModel.destinationIpaddress2) + "." + parseInt(vm.ruleModel.destinationIpaddress3) + "." + parseInt(vm.ruleModel.destinationIpaddress4) + "/" + parseInt(vm.ruleModel.destinationIpaddress5);
				vm.cidrbError = true;
			}else{
				vm.cidrbError = false;
			}
		};
    }]);