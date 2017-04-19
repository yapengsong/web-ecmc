/**
 * Created by liyanchao on 2016/4/19.
 */
'use strict';

angular.module('eayun.net')
    .controller('NetBalancePoolDetechLbMonitorCtrl', ['$scope','NetPoolService', '$http','toast','eayunModal','resourcePool',function ($scope,NetPoolService, $http,toast,eayunModal ,resourcePool) {
        var vm = this;

        vm.haveBindLbMonitorList = {};
        vm.lbMonitor = {};

        vm.lbMonitor.poolId = resourcePool.poolId;
        vm.lbMonitor.dcId = resourcePool.dcId;
        vm.lbMonitor.prjId = resourcePool.prjId;
        /*vm.lbMember.poolName = resourcePool.poolName;*/
        console.info(vm.lbMember);


        /*根据项目id查询所有子网*/
        NetPoolService.getHaveBindLbMonitor(resourcePool).then(function(response){
            /*console.info(response.data);*/
            vm.haveBindLbMonitorList = response.data;
           /* console.info(vm.haveBindLbMonitorList);*/
        });


        /*pool绑定健康检查的提交*/
        $scope.commit = function () {
            var promise;
            if (null!=vm.lbMonitor) {
                promise = NetPoolService.detechLbMonitor(vm.lbMonitor);
            }
            promise.then(function (data) {
                $scope.ok(data);
            }, function () {
                //eayunModal.error("保存失败",500);
            });
        };





    }]);