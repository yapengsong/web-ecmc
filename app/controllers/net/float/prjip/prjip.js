/**
 * Created by ZHL on 2016/4/7.
 */
'use strict';

angular.module('eayun.net')
    .controller('PrjIPCtrl', ['SysCode','$scope','HomeCommonService','floatService',function (SysCode,$scope,HomeCommonService,floatService) {
        var vm = this;
        vm.params = {
            project:'',
            datacenter:'',
            num:''
        };
        vm.dcList = {};
        vm.prjList = {};
        HomeCommonService.getDcList().then(function (data) {
            vm.dcList = data;
        });
        vm.dcChange = function () {
            vm.params.project = '';
            HomeCommonService.getPrjByDcId(vm.params.datacenter).then(function (data) {
                vm.prjList = data;
                //vm.dcPrjChange();
            });
        };
        vm.isHaveNum = true;
        vm.checkIpNum = false;
        vm.dcPrjChange = function () {
            if(vm.params.num ==undefined ||vm.params.num ==''|| vm.params.datacenter ==undefined || vm.params.project == undefined){
                vm.checkIpNum = false;
                return ;
            }
            floatService.checkPrjIpNum(vm.params.project).then(function (data) {
                if(data.respCode == SysCode.success){
                    if(data.data > 0){
                        vm.isHaveNum = true;
                       //vm.params.num='';
                    }else{
                        vm.isHaveNum = false;
                    }
                }
                //校验ip数量
                floatService.checkIpNum(vm.params.project,vm.params.num).then(function (data) {
                    if(data.respCode == SysCode.success){
                        vm.checkIpNum = !data.data;

                    }
                });
            });
        };
        vm.checkIp = function () {
            if(vm.params.num ==undefined ||vm.params.num ==''|| vm.params.datacenter ==undefined || vm.params.project == undefined){
                vm.checkIpNum = false;
                return ;
            }
            vm.checkIpNum = false;
            if(vm.params.project.length<=0){
                return true;
            }
            return floatService.checkIpNum(vm.params.project,vm.params.num).then(function (data) {
                if(data.respCode == SysCode.success){
                    vm.checkIpNum = ! data.data;
                }else{
                    vm.checkIpNum =  false;
                }
            });
        };
        $scope.commit = function () {
            $scope.ok(vm.params);
        };
    }]);