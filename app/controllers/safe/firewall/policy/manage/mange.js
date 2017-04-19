/**
 * Created by eayun on 2016/4/19.
 */
'use strict'

angular.module('eayun.safe')
    .controller('SafeFirewallPolicyManageCtrl', ['$scope', '$state', 'FwService', 'policyModel', function ($scope, $state, FwService, policyModel) {
        var vm = this;

        vm.policyModel = policyModel;

        FwService.getRuleListToSelect(policyModel.prjId).then(function (response) {

            vm.ruleListToSelect = response.data;
        });

        FwService.getRuleListIsSelected(policyModel.fwpId).then(function (response) {
            vm.ruleListIsSelected = response.data;
        });

        vm.addRuleToList = function (_rule) {
            vm.ruleListIsSelected.push(_rule);
            for (var i = 0; i < vm.ruleListToSelect.length; i++) {
                if (vm.ruleListToSelect[i].fwrId == _rule.fwrId) {
                    vm.ruleListToSelect.splice(i, 1);
                    break;
                }
            }
        };

        vm.removeRuleFromList = function (_rule) {
            vm.ruleListToSelect.push(_rule);
            for (var i = 0; i < vm.ruleListIsSelected.length; i++) {
                if (vm.ruleListIsSelected[i].fwrId == _rule.fwrId) {
                    vm.ruleListIsSelected.splice(i, 1);
                    break;
                }
            }
        };

        vm.goFirewallRule = function () {
            $state.go('app.safe.tabs.firewall.rule');
            $scope.cancel();
        };

        $scope.commit = function () {
            vm.policyModel.firewallRules = vm.ruleListIsSelected;
            $scope.ok(vm.policyModel);
        }
    }]);