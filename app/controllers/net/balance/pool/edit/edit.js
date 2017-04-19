/**
 * Created by liyanchao on 2016/4/18.
 */
'use strict';

angular.module('eayun.net')
    .controller('NetBalanceEditPoolCtrl', ['NetPoolService', '$scope','$http','eayunModal','toast','resourcePool',function (NetPoolService, $scope,$http,eayunModal,toast,resourcePool ) {
        var vm = this;
        vm.resourcePool=resourcePool;

        /*检查是否重名*/
        vm.checkPoolName = function () {
            NetPoolService.checkPoolName(vm.resourcePool).then(function(response){
                vm.checkName = response.data.data;
            });
        };


        /*编辑pool的提交*/
        $scope.commit = function () {
            var promise;
            promise = NetPoolService.editPool(vm.resourcePool);

            promise.then(function (data) {
                $scope.ok(data);
            }, function () {
                //eayunModal.error("保存失败",500);
            });
        };





    }]);