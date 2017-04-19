/**
 * Created by eayun on 2016/4/17.
 */
'use strict'

angular.module('eayun.safe')
    .controller('SafeFirewallPolicyEditCtrl', ['$scope', 'HomeCommonService', 'FwService', 'policyModel', function ($scope, HomeCommonService, FwService, policyModel) {
        var vm = this;
        vm.fwPolicyNameIsExist = false;
        vm.policyModel = angular.copy(policyModel, {});

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

        vm.getAllProjectListByDcId(policyModel.dcId);

        vm.checkFwpName = function (value) {
            if (vm.policyModel.fwpName == undefined) {
                vm.fwPolicyNameIsExist = false;
                return;
            }

            FwService.checkFwpName(vm.policyModel, value).then(function(response){
                vm.fwPolicyNameIsExist = !response;
            });
        };

        $scope.commit = function () {
            var resultData = FwService.transferDataForPolicyCommit(vm.policyModel, vm.ruleListIsSelected);
            $scope.ok(resultData);
        };
    }]);