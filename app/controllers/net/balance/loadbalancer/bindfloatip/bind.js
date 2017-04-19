/**
 * Created by ZH.F on 2016/4/27.
 */
'use strict';
angular.module('eayun.net')
    .controller('LoadBalancerFloIpBindCtrl', ['$scope', 'LoadBalancerService', 'resourcePool', '$http', 'toast', 'eayunModal','NetPoolService',
        function ($scope, LoadBalancerService, resourcePool, $http, toast, eayunModal, NetPoolService) {
            var vm = this;

            $scope.btnDis = false;
            vm.resourcePool = resourcePool;
            vm.floatIps = {};
            NetPoolService.getUnBindFloatIp(resourcePool.prjId).then(function(response){
                vm.floatIps = response.data.data;
            });

            /**
             * 确定
             */
            $scope.commit = function (){
                $scope.btnDis = true;
                var promise;
                var data ={
                    dcId:vm.resourcePool.dcId,
                    prjId:vm.resourcePool.prjId,
                    floId: vm.floatIp.floId,
                    floIp: vm.floatIp.floIp,
                    resourceId:vm.resourcePool.poolId,
                    resourceType:'lb',
                    portId:vm.resourcePool.portId,
                };
                promise = LoadBalancerService.bindFloatIp(data);
                promise.then(function () {
                    toast.success('绑定公网IP'+vm.floatIp.floIp+'成功',2000);
                    $scope.ok();
                }, function () {
                    //eayunModal.error("绑定公网IP失败", 500);
                    $scope.btnDis = false;
                });

            };

        }]);