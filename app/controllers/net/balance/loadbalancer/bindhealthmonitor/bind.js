/**
 * Created by ZH.F on 2016/4/27.
 */
'use strict';
angular.module('eayun.net')
    .controller('LoadBalancerMonitorBindCtrl', ['$scope', 'LoadBalancerService', 'resourcePool', '$http', 'toast', 'eayunModal',
        function ($scope, LoadBalancerService, resourcePool, $http, toast, eayunModal) {
            var vm = this;

            vm.resourcePool = resourcePool;
            vm.monitors = {};
            LoadBalancerService.getMonitorListByPool(vm.resourcePool).then(function (response) {
                vm.monitors = response.data.data;
            });

            /**
             * checkbox 选择数据
             */
            vm.selectData = function (){
                var data = [];
                var index = 0;
                for(var i=0;i<vm.monitors.length;i++){
                    var mon = vm.monitors[i];
                    if(mon.check){
                        data[index++] =mon.ldmId;
                    }
                }
                return data;
            };

            /**
             * 确定
             */
            $scope.commit = function (){
                var promise;
                vm.checkBtn = true;
                var monitors = vm.selectData();
                if(monitors&&monitors.length>10){
                    eayunModal.error('最多只能关联10条健康检查');
                    vm.checkBtn = false;
                    return ;
                }
                var data ={
                    dcId:vm.resourcePool.dcId,
                    prjId:vm.resourcePool.prjId,
                    poolId:vm.resourcePool.poolId,
                    poolName:vm.resourcePool.poolName,
                    monitors:monitors
                };
                promise = LoadBalancerService.bindLbMonitor(data);
                promise.then(function () {
                    toast.success('绑定健康检查成功',2000);
                    $scope.ok();
                }, function () {
                    vm.checkBtn = false;
                });

            };

        }]);