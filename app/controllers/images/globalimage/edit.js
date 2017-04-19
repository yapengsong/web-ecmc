
'use strict';

angular.module('eayun.image')
    .controller('GloEditCtrl', ['$scope','SysCode','GlobalService','item','HomeCommonService',function ($scope,SysCode,GlobalService,item,HomeCommonService) {
        var vm = this;

        vm.item = angular.copy(item,{});
        vm.isCheckName = true;


        if('null'==vm.item.imageDescription||null==vm.item.imageDescription){
            vm.item.imageDescription='';
        }

        if('null'==vm.item.sysDetail||null==vm.item.sysDetail){
            vm.item.sysDetail='';
        }

        if('null'==vm.item.integratedSoftware||null==vm.item.integratedSoftware){
            vm.item.integratedSoftware='';
        }

        GlobalService.getAllVmSysList().then(function (data) {
            vm.sysList = data;
        });

        HomeCommonService.getMarketTypeList().then(function(data) {
            vm.marketTypeList = data.data;
        });

        vm.minDisk= 20;
        if(vm.item.osType == '0007002002001'){
            vm.minDisk = 60;
        }else if(vm.item.osType == '0007002002002'){
            vm.minDisk = 20;
        };


        vm.dcSysChange = function(sysType){
            vm.item.osType='';
            vm.item.sysType='';
            for(var i= 0;i<vm.sysList.length;i++){
                var node=vm.sysList[i];
                if(sysType==node.nodeId){
                    vm.item.osType=node.parentId;
                    vm.item.sysType=node.nodeId;
                    if(node.parentId == '0007002002001'){
                        vm.minDisk = 60;
                        if('3'==vm.item.imageIspublic){
                            vm.item.sysdiskSize=60;
                        }
                    }else if(node.parentId == '0007002002002'){
                        vm.minDisk = 20;
                        if('3'==vm.item.imageIspublic){
                            vm.item.sysdiskSize=20;
                        }
                    }
                    break;
                }

            }
        };


        vm.minCpuError=false;
        vm.maxCpuError=false;
        vm.checkCPU = function (type) {
            if(null!=vm.item.minCpu&&null!=vm.item.maxCpu&&''!=vm.item.minCpu&&''!=vm.item.maxCpu){
                if(Number(vm.item.minCpu)>Number(vm.item.maxCpu)||Number(vm.item.minCpu)===Number(vm.item.maxCpu)){
                    if('min'===type){
                        vm.minCpuError=true;
                    }else if('max'===type){
                        vm.maxCpuError=true;
                    };
                }else{
                    vm.minCpuError=false;
                    vm.maxCpuError=false;
                }
            }else{
                    vm.minCpuError=false;
                    vm.maxCpuError=false;
            };
        };
        vm.minRamError=false;
        vm.maxRamError=false;
        vm.checkRAM = function (type) {
            if(null!=vm.item.minRam&&null!=vm.item.maxRam&&''!=vm.item.minRam&&''!=vm.item.maxRam){
                if(Number(vm.item.minRam)>Number(vm.item.maxRam)||Number(vm.item.minRam)===Number(vm.item.maxRam)){
                    if('min'===type){
                        vm.minRamError=true;
                    }else if('max'===type){
                        vm.maxRamError=true;
                    };
                }else{
                    vm.minRamError=false;
                    vm.maxRamError=false;
                }
            }else{
                vm.minRamError=false;
                vm.maxRamError=false;
            };
        };


        vm.isDiskOk = false;
        /*vm.checkName = function(name){
            GlobalService.checkName(vm.item).then(function (data) {
                if(data.respCode == SysCode.success){
                    vm.isCheckName = data.data;
                }
            });
        };
        vm.checkName(vm.item);*/


        $scope.commit = function () {
            $scope.ok(vm.item);
        };
    }]);