/**
 * Created by ZHL on 2016/4/7.
 */
'use strict';

angular.module('eayun.net')
    .controller('BindCtrl', ['$scope','HomeCommonService','floatService','floId','prjId',function ($scope,HomeCommonService,floatService,floId,prjId) {
        var vm = this;
        vm.params = {
            floId:floId,
            resourceType:'vm',
            resourceId:''
        };
        vm.prjId = prjId;
        vm.netList = {};
        vm.subnetList = {};
        vm.resourceList = {};
        vm.netId = '';
        vm.subnetId = '';
        floatService.getNetList(vm.prjId).then(function (data) {
            vm.netList = data.data;
        });
        vm.dcNetChange = function () {
            vm.subnetId = '';
            floatService.getSubList(vm.netId).then(function (data) {
                vm.subnetList = data.data;
                vm.dcSubOrTypeChange();
            });
        };
        vm.dcSubOrTypeChange = function () {
            vm.params.resourceId = '';
            vm.resource = {};
            vm.resourceList = {};
            if(vm.params.resourceType == 'vm'){
                floatService.getVMListByPrj(vm.subnetId).then(function (data) {
                    vm.resourceList = data.data;
                });
            }else if(vm.params.resourceType == 'lb'){
                floatService.getLBListByPrj(vm.subnetId).then(function (data) {
                    vm.resourceList = data.data;
                });
            }
        };
        vm.substrSubnetName = function (text){
            var testSubstr = text;
            var perText = text.substr(0,text.indexOf('('));
            if(perText.length>12){
                perText = perText.substr(0,12)+"...";
            }
            testSubstr = perText + text.substr(text.indexOf('('),text.length-1);
            return testSubstr;
        };
        $scope.commit = function () {
            if(vm.params.resourceType == 'vm'){
                vm.params.resourceId = vm.resource.vmId;
                vm.params.vmIp = vm.resource.vmIp;
            }
            else if(vm.params.resourceType == 'lb'){
                vm.params.resourceId = vm.resource.poolId;
            }
            $scope.ok(vm.params);
        };
    }]);