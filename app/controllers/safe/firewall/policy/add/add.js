/**
 * Created by eayun on 2016/4/17.
 */
'use strict'

angular.module('eayun.safe')
    .controller('SafeFirewallPolicyAddCtrl', ['$scope', 'HomeCommonService', 'FwService', function ($scope, HomeCommonService, FwService) {
        var vm = this;
        vm.fwPolicyNameIsExist = false;
        vm.policyModel = {};

        FwService.getDcResourceList().then(function (response) {
            vm.allDcResourceList = response;
        });

        //切换项目把策略名称置空
        vm.changePrj = function () {
            vm.checkFwpName();
        };

        vm.getAllProjectListByDcId = function (_dcId) {
            if (_dcId) {
                HomeCommonService.getPrjByDcId(_dcId).then(function (response) {
                    vm.allProjectList = response;
                    vm.policyModel.prjId='';
                });
            }
        };

        vm.checkFwpName = function () {
            if(vm.policyModel.prjId ==undefined ||vm.policyModel.prjId ==''|| vm.policyModel.dcId ==undefined|| vm.policyModel.fwpName == undefined){
                vm.fwPolicyNameIsExist = false;
                return ;
            }
            FwService.checkFwpName(vm.policyModel).then(function(response){
                vm.fwPolicyNameIsExist = !response;
            });
        };

        $scope.commit = function () {
            var resultData = FwService.transferDataForPolicyCommit(vm.policyModel);
            $scope.ok(resultData);
        }
    }]);