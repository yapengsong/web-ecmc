/**
 * Created by liyanchao on 2016/4/19.
 */
'use strict';

angular.module('eayun.net')
    .controller('NetBalancePoolBindLbMonitorCtrl', ['$scope','NetPoolService', '$http','toast','eayunModal','resourcePool',function ($scope,NetPoolService, $http,toast,eayunModal ,resourcePool) {
        var vm = this;

        vm.lbMonitor = {};
        vm.UnBindLbMonitorList = {};
        vm.lbMonitor.poolId = resourcePool.poolId;

        /*根据项目id查询所有子网*/
        NetPoolService.getUnBindLbMonitor(resourcePool).then(function(response){
            vm.UnBindLbMonitorList = response.data;
        });


        /*pool绑定健康检查的提交*/
        $scope.commit = function () {
            var promise;
            if (null!=vm.lbMonitor) {
                promise = NetPoolService.bindLbMonitor(vm.lbMonitor);
            }
            promise.then(function (data) {
                $scope.ok(data);
            }, function () {
                //eayunModal.error("保存失败",500);
            });
        };





    }]);