/**
 * Created by eayun on 2016/4/20.
 */
'use strict'

angular.module('eayun.net')
    .controller('NetExternalAddSubnetCtrl', ['$scope', 'netId', 'prjId', 'dcId', 'NetExternal','SysCode','toast','eayunModal','utils',
            function ($scope, netId, prjId, dcId,NetExternal,SysCode,toast,eayunModal,utils) {
        var vm = this;
        vm.subnetModel = {
            netId:netId,
            dcId:dcId,
            prjId:prjId,
            ipVersion:'IPv4'
        };

        vm.checkSubName=function(){
            NetExternal.checkOutSubnetName(vm.subnetModel.netId,null,vm.subnetModel.subnetName).then(function(response){
                vm.checkSubNetNameFlag=response.data;
            });
        }
        $scope.commit = function (){
            NetExternal.addOutSubnet(vm.subnetModel).then(function (response) {
                switch (response.respCode) {
                    case SysCode.error:
                        eayunModal.error("添加子网" + vm.subnetModel.subnetName + "失败");
                        return;
                    case SysCode.success:
                        console.info(response.data.subnetName);
                        toast.success("添加子网" + utils.ellipsis(response.data.subnetName, 10) + "成功");
                        $scope.ok();
                        return;
                    default:
                        toast.success("添加子网" + utils.ellipsis(response.data.subnetName, 10) + "成功");
                        return;
                }
            }, function () {

            });

        };
    }]);