/**
 * Created by ZH.F on 2016/4/27.
 */
'use strict';

angular.module('eayun.net')
    .controller('LoadBalancerAddCtrl', ['$scope', 'LoadBalancerService', 'HomeCommonService', '$http', 'toast', 'eayunModal',
        function ($scope, LoadBalancerService, HomeCommonService, $http, toast, eayunModal) {
            var vm = this;

            vm.resourcePool = {};

            vm.dcList = {};
            vm.prjList = {};
            vm.netId = '';
            vm.netList = {};
            vm.subList = {};

            HomeCommonService.getDcList().then(function (response) {
                vm.dcList = response;
            });

            vm.getProjectListByDcId = function (_dcId) {
                HomeCommonService.getPrjByDcId(_dcId).then(function (response) {
                    vm.prjList = response;

                });
                vm.resourcePool.prjId = '';
                vm.resourcePool.subnetId='';
                vm.netId = '';
                vm.netList = {};
                vm.subList = {};
            };

            vm.getNetListByPrjId = function (_prjId) {
                vm.netId = '';
                vm.resourcePool.subnetId='';
                vm.subList={};
                LoadBalancerService.getNetListByPrjId(_prjId).then(function (response) {
                    vm.netList = response.data;
                    vm.getSubNetListByNetId(vm.netId);
                });
                vm.checkPoolName();
            };

            vm.getSubNetListByNetId = function(_netId){
                vm.resourcePool.subnetId='';
                vm.subList={};
                LoadBalancerService.getSubNetListByNetId(_netId).then(function(response){
                    vm.subList = response.data;
                });
            };

            /*检查是否重名*/
            vm.checkPoolName = function () {
                LoadBalancerService.checkPoolName(vm.resourcePool).then(function (response) {
                    vm.checkName = response.data.data;
                });
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

            vm.checkBtn = false;
            /*创建pool的提交*/
            $scope.commit = function () {
                var promise;
                vm.checkBtn=true;
                promise = LoadBalancerService.addPool(vm.resourcePool);
                promise.then(function (data) {
                    $scope.ok(data);
                }, function () {
                    vm.checkBtn = false;
                });
            };

        }]);