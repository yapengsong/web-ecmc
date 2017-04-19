/**
 * Created by eayun on 2016/4/19.
 */
'use strict'

angular.module('eayun.safe')
    .controller('SafecloudhostManageCtrl', ['$scope', '$state', 'SafeGroupService','policyModel' , function ($scope, $state, SafeGroupService,policyModel) {
        var vm = this;
        vm.model=policyModel;

        vm.checkFag=true;
        vm.ruleListToSelect=policyModel;
        vm.ruleListIsSelected=[];

        vm.addRuleToList = function (_rule) {
            vm.ruleListIsSelected.push(_rule);
            if(vm.ruleListIsSelected.length>0){
                vm.checkFag=false;
            }
            for (var i = 0; i < vm.ruleListToSelect.length; i++) {
                if (vm.ruleListToSelect[i].vmid == _rule.vmid) {
                    vm.ruleListToSelect.splice(i, 1);
                    break;
                }
            }
        };

        vm.removeRuleFromList = function (_rule) {
            vm.ruleListToSelect.push(_rule);

            for (var i = 0; i < vm.ruleListIsSelected.length; i++) {
                if (vm.ruleListIsSelected[i].vmid == _rule.vmid) {
                    vm.ruleListIsSelected.splice(i, 1);
                    break;
                }

            }

            if(vm.ruleListIsSelected.length==0){
                vm.checkFag=true;
            }
        };



        $scope.commit = function () {
            vm.model.cloudhostlist = vm.ruleListIsSelected;
            $scope.ok(vm.model);
        }
    }]);