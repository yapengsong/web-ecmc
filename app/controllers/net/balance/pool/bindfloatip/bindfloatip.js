/**
 * Created by liyanchao on 2016/4/18.
 */
'use strict';

angular.module('eayun.net')
    .controller('NetBalancePoolBindFloateIpCtrl', ['$scope','NetPoolService', '$http','toast','eayunModal','resourcePool',function ($scope,NetPoolService, $http,toast,eayunModal ,resourcePool) {
        var vm = this;

        vm.float = {};
        vm.unBindFloatList = {};
        vm.float.poolId = resourcePool.poolId;
        vm.float.vipId = resourcePool.vipId;

        /*根据项目id查询所有子网*/
        NetPoolService.getUnBindFloatIp(resourcePool.prjId).then(function(response){
            vm.unBindFloatList = response.data.data;
        });



        /*pool绑定floatIP的提交*/
        $scope.commit = function () {
            var promise;
            if (null!=vm.float) {
                promise = NetPoolService.bindFloatIp(vm.float);
            }
            promise.then(function (data) {
                $scope.ok(data);
            }, function () {
                //eayunModal.error("保存失败",500);
            });
        };





    }]);