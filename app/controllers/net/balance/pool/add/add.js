/**
 * Created by liyanchao on 2016/4/18.
 */
'use strict';

angular.module('eayun.net')
    .controller('NetBalanceAddPoolCtrl', ['$scope','NetPoolService', '$http','toast','eayunModal',function ($scope,NetPoolService, $http,toast,eayunModal ) {
        var vm = this;

        vm.resourcePool={};
        vm.dcList = {};
        vm.prjList = {};
        vm.subList = {};

        /*获取数据中心list*/
        NetPoolService.getDcResourceList().then(function (response) {
            vm.dcList = response.data;
        });
        /*根据dcId查询prjList*/
        vm.getProjectListByDcId = function(dcId){
            NetPoolService.getProjectListByDcId(dcId).then(function(response){
                vm.prjList = response.data;
                if(vm.prjList.length>0){
                    vm.getSubNetListByPrjId();
                }else{
                    vm.prjList = '';
                    vm.subList = '';
                }

            });
        };

        /*根据项目id查询所有子网*/
        vm.getSubNetListByPrjId = function (){
            NetPoolService.getSubNetListByPrjId(vm.resourcePool).then(function(response){
                vm.subList = response.data;
            });
            vm.checkPoolName();
        };

        /*检查是否重名*/
        vm.checkPoolName = function () {
            NetPoolService.checkPoolName(vm.resourcePool).then(function(response){
                vm.checkName = response.data.data;
            });
        };
        /*创建pool的提交*/
        $scope.commit = function () {
            var promise;
            promise = NetPoolService.addPool(vm.resourcePool);
            /*if (vm.resourcePool.id) {
                promise = NetPoolService.editPool(vm.resourcePool);
            } else {
                promise = NetPoolService.addPool(vm.resourcePool);
            }*/
            promise.then(function (data) {
                $scope.ok(data);
            }, function () {
                //eayunModal.error("保存失败",500);
            });
        };





    }]);