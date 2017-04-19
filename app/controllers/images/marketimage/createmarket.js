
'use strict'

angular.module('eayun.image')
    .controller('CreateMarketImageCtrl', ['$scope','marketimageService',  'HomeCommonService', 'eayunModal',  'toast','SysCode',
        function ($scope,marketimageService, HomeCommonService, eayunModal, toast,SysCode) {
            var vm = this;
            vm.imageItem = {
                'createType':'1',
                'file':[]
            };
            HomeCommonService.getDcList().then(function (data) {
                vm.dcList = data;
            });
            marketimageService.getImageFormat().then(function(data){
                vm.imList = data;
            });
            marketimageService.getAllVmSysList().then(function (data) {
                vm.sysList = data;
            });

            HomeCommonService.getMarketTypeList().then(function(data) {
                vm.marketTypeList = data.data;
            });

            vm.minDiskValue = 20;
            vm.dcSysChange = function(sysType){
                vm.imageItem.osType=sysType.parentId;
                vm.imageItem.sysType=sysType.nodeId;
                if(sysType.parentId == '0007002002001'){
                    vm.imageItem.sysdiskSize = 60;
                }else if(sysType.parentId == '0007002002002'){
                    vm.imageItem.sysdiskSize = 20;
                }
            };
            /*vm.checkimNameFlag = true;
            vm.checkImName = function () {
                vm.item = {
                    imageIspublic:'3',
                    dcId:vm.imageItem.dcId,
                    imageName:vm.imageItem.imageName
                };
                marketimageService.checkName(vm.item).then(function(data){
                    if(data.respCode == SysCode.success){
                        vm.checkimNameFlag = data.data;
                    }
                });
            };*/
            vm.fileTypes = ['iso','img','qcow2','raw'];
            vm.uploadFiles = function (file) {
                if(file){
                    if(vm.imageItem.file.length>=1){
                        eayunModal.warning("附件总数不能超过1个");
                        return;
                    }
                    vm.fileName = file.name;
                    vm.imageItem.file.push(file);
                }
            };
            vm.minCpuError=false;
            vm.maxCpuError=false;
            vm.checkCPU = function (type) {
                if(null!=vm.imageItem.minCpu&&null!=vm.imageItem.maxCpu&&''!=vm.imageItem.minCpu&&''!=vm.imageItem.maxCpu){
                    if(Number(vm.imageItem.minCpu)>Number(vm.imageItem.maxCpu)||Number(vm.imageItem.minCpu)===Number(vm.imageItem.maxCpu)){
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
                if(null!=vm.imageItem.minRam&&null!=vm.imageItem.maxRam&&''!=vm.imageItem.minRam&&''!=vm.imageItem.maxRam){
                    if(Number(vm.imageItem.minRam)>Number(vm.imageItem.maxRam)||Number(vm.imageItem.minRam)===Number(vm.imageItem.maxRam)){
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
            vm.deleteWorkFile=function(file){
                vm.fileName = '';
                for(var i=0;i<vm.imageItem.file.length;i++){
                    var file1 = vm.imageItem.file[i];
                    if(file1==file){
                        vm.imageItem.file.splice(i, 1);
                    }
                }
            };

            //重新上传
            vm.refushWorkFile=function(file,haveFile){
                vm.deleteWorkFile(haveFile);
                vm.uploadFiles(file);
            };

            vm.shortName = function (name) {
                if (name && name.length > 15)
                    return name.substring(0, 15) + '...';
                return name;
            };

            $scope.commit = function () {
               // $("#loadingBar").show();
               if('1'==vm.imageItem.createType){
                   vm.imageItem.imageUrl=null;
               }
                marketimageService.createMarketImage(vm.imageItem).then(function (data) {
                   // $("#loadingBar").hide();
                    $scope.ok(data);
                }, function () {
                  //  $("#loadingBar").hide();
                    eayunModal.error('市场镜像上传失败');
                });
            };
        }]);