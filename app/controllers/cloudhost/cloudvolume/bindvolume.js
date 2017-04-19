/**
 * Created by eayun on 2016/4/18.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('CloudhostVolumeBindCtrl', ['$scope','HostService', 'VolumeService','volume','eayunModal' ,function ($scope,HostService, VolumeService,volume,eayunModal) {
        var vm = this;
        vm.volModel =volume;
        vm.host={};

        HostService.getCloudVmToBind(volume.prjId).then(function (data) {
            vm.vmList = new Array();
            if(data != null && data.length > 0){
                for(var i=0; i<data.length; i++){
                    var status=data[i].vmStatus.toString().toLowerCase();
                    //只有如下状态的云主机能够挂载云硬盘
                    if(status == "active" || status == "paused"
                        || status == "shutoff" || status == "verify_resize"
                        ||status == "soft_deleted"){
                        vm.vmList.push(data[i]);
                    }
                }
            }
        });


        $scope.commit = function () {
            HostService.getDiskCountByVm(vm.host.vmId).then(function (data){
                var count=data;
                if(count>=5){
                    eayunModal.error('该云主机已挂载5块数据盘');
                    return ;
                }else{
                        vm.volModel.vmId=vm.host.vmId;
                        vm.volModel.vmName=vm.host.vmName;
                        $scope.ok(vm.volModel);
                }
            });
        };


    }]);