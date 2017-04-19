/**
 * Created by eayun on 2016/4/18.
 */
'use strict'

angular.module('eayun.safe')
    .controller('SafeFirewallListEditCtrl', ['$scope', 'HomeCommonService', 'FwService', 'fwModel', function ($scope, HomeCommonService, FwService, fwModel) {
        var vm = this;
        vm.fwNameIsExist = false;
        vm.fwModel = angular.copy(fwModel, {});
        vm.fwPolicyList ={};
        FwService.getDcResourceList().then(function (response) {
            vm.allDcResourceList = response;
        });

        HomeCommonService.getPrjByDcId(fwModel.dcId).then(function (response) {
            vm.allProjectList = response;
        });

        vm.changeDorPId = function () {
            FwService.getPolicyListByDcIdPrjId(vm.fwModel).then(function (response) {
                vm.fwPolicyList = response;
            });
        };

        vm.changeDorPId(vm.fwModel);

        vm.getProjectListByDcId = function (_dcId) {
            HomeCommonService.getPrjByDcId(_dcId).then(function (response) {
                vm.allProjectList = response;
            });
            vm.changeDorPId();
        };

        vm.checkFwName = function () {
            if (vm.fwModel.fwName == undefined) {
                vm.fwNameIsExist = false;
                return;
            }
            FwService.checkFireWallName(vm.fwModel).then(function(response){
                vm.fwNameIsExist = !response;
            });




            //return FwService.checkFireWallName(vm.fwModel);
        };

        $scope.commit = function () {
            var resultData = FwService.transferDataForCommit(vm.fwModel);
            $scope.ok(resultData);
        };
    }]);