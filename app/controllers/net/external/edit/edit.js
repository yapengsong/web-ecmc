/**
 * Created by eayun on 2016/4/20.
 */
'use strict'

angular.module('eayun.net')
    .controller('NetExternalEditSubnetCtrl', ['$scope', 'subnetModel','NetExternal','dcId','SysCode','toast','eayunModal','utils',
        function ($scope, subnetModel,NetExternal,dcId,SysCode,toast,eayunModal,utils) {
        var vm = this;

        vm.subnetModel = angular.copy(subnetModel, {});


        vm.checkSubName=function(){
            console.info(vm.subnetModel);
            NetExternal.checkOutSubnetName(vm.subnetModel.netId,vm.subnetModel.subnetId,vm.subnetModel.subnetName).then(function(response){
                vm.checkSubNetNameFlag=response.data;
            });
        }

        $scope.commit = function () {
            vm.subnetModel.dcId=dcId;
            NetExternal.editOutSubnet(vm.subnetModel).then(function (response) {
                switch (response.respCode) {
                    case SysCode.error:
                        eayunModal.error("编辑外网子网" + vm.subnetModel.subnetName + "失败");
                        return;
                    case SysCode.success:
                        toast.success("编辑外网子网" + utils.ellipsis(vm.subnetModel.subnetName, 8) + "成功");
                        $scope.ok();
                        return;
                    default:
                        toast.success("编辑外网子网" + utils.ellipsis(vm.subnetModel.subnetName, 8) + "成功");
                        vm.table.api.draw();
                        return;
                }
            });

        };
    }]);