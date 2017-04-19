/**
 * Created by eayun on 2016/4/15.
 */
'use strict'

angular.module('eayun.safe')
    .controller('SafeFirewallRuleEditCtrl', ['$scope', 'HomeCommonService', 'FwService', 'ruleModel', function ($scope, HomeCommonService, FwService, ruleModel) {
        var vm = this;

        vm.ruleModel = angular.copy(ruleModel, {});
        vm.fwRuleNameIsExist = false;
        if(null==vm.ruleModel.protocol||''==vm.ruleModel.protocol||'null'==vm.ruleModel.protocol){
            vm.ruleModel.protocol='any';
        }
        FwService.getDcResourceList().then(function (response) {
            vm.allDcResourceList = response;
        });

        vm.getAllProjectListByDcId = function (_dcId) {
            if (_dcId) {
                HomeCommonService.getPrjByDcId(_dcId).then(function (response) {
                    vm.allProjectList = response;
                });
            }
        };

        vm.getAllProjectListByDcId(ruleModel.dcId);

        vm.changePrj = function () {
            vm.checkFwRuleName();
        };

        vm.checkFwRuleName = function () {
            if (vm.ruleModel.fwrName == undefined) {
                vm.fwRuleNameIsExist = false;
                return;
            }
            FwService.checkFwrName(vm.ruleModel).then(function(response){
                vm.fwRuleNameIsExist = !response;
            });
        };

        vm.checkIp = function (_value, _flagName) {
            return FwService.checkIp(vm, _value, _flagName);
        };

        vm.checkPort = function (_value, _flagName) {
            return FwService.checkPort(vm, _value, _flagName);
        };

        $scope.commit = function () {
            var resultData = FwService.transferDataForRuleCommit(vm.ruleModel);
            resultData.id = vm.ruleModel.fwrId;
            $scope.ok(resultData);
        };
    }]);