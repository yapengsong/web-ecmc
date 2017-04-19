/**
 * Created by eayun on 2016/4/26.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('CloudhostHostImageCtrl', ['vmModel', 'HostService', 'eayunModal', 'toast', '$scope', '$state', function (vmModel, HostService, eayunModal, toast, $scope, $state) {
        var vm = this;

        vm.vmModel = angular.copy(vmModel, {});
        vm.vmModel.imageName = null;

        vm.checkImageName = function () {
            if(vm.vmModel.imageName){
                HostService.checkImageName({
                    imageName: vm.vmModel.imageName,
                    prjId: vm.vmModel.prjId,
                    dcId: vm.vmModel.dcId,
                    imageIspublic: '2'
                }).then(function (data) {
                    vm.nameIsExist = data;
                });
            }
        };

        vm.commit = function () {
            eayunModal.confirm('创建过程会引起云主机重启，确定立即创建自定义镜像？').then(function () {
                HostService.getImageCountByPrjId(vm.vmModel.prjId).then(function (count) {
                    HostService.createSnapshot(vm.vmModel).then(function () {
                        toast.success('开始创建自定义镜像' + (vm.vmModel.imageName.length > 6 ? vm.vmModel.imageName.substr(0,6) + '...' : vm.vmModel.imageName));
                        $scope.ok();
                    });
                },function(message){
                    eayunModal.error(message);
                });
            });
        };
    }]);