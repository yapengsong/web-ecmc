/**
 * Created by ljg on 2016/7/29.
 */
'use strict'

angular.module('eayun.safe')
    .controller('SafeFwRuleSequenceCtrl', ['fwRule', 'FwService','$scope','fwpId', function (fwRule,FwService, $scope,fwpId) {
        var vm = this;
        vm.fwRule = fwRule;
        vm.reference={};
        vm.local='pre';
        vm.target = {};
        var i,ruleModel;
        FwService.getRuleListIsSelected(fwpId).then(function (response){
        	vm.pRuleList = response.data;
        	for(i=0;i<vm.pRuleList.length;i++){
				ruleModel = vm.pRuleList[i];
				if(vm.fwRule.fwrName!=ruleModel.fwrName){
					vm.reference = ruleModel.fwrId;
					break;
				}
			}
        });
        FwService.queryById(fwpId).then(function (response){
        	vm.fwpOne = response.data;
        });
        vm.RuleSQCommit = function (_data,_reference,_target,_local) {
            var data = {
                fwp: _data,
                reference: _reference,
                target: _target,
                fwrName: vm.fwRule.fwrName,
                local: _local
            };
            return data;
        };
        $scope.commit = function () {
            var resultData = FwService.transferDataForPolicyCommit(vm.fwpOne);
            var data = vm.RuleSQCommit(resultData, vm.reference, vm.fwRule.fwrId, vm.local)
            $scope.ok(data);
        };
 }]);