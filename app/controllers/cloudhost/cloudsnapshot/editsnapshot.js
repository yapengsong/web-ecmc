/**
 * Created by eayun on 2016/3/21.
 */
'use strict';

angular.module('eayun.cloudhost')
    .controller('CloudhostEditSnapshotCtrl', ['$scope','SnapshotService','snapshot',  function ($scope,SnapshotService,snapshot) {
        var vm = this;
        vm.snapModel = angular.copy(snapshot,{});

       if(null==vm.snapModel.snapDescription||'null'==vm.snapModel.snapDescription){
            vm.snapModel.snapDescription='';
        }

        //校验名称格式和唯一性
        vm.checkSnapName = function (value) {
            var snapshot=vm.snapModel;
            snapshot.snapName=value;
            return SnapshotService.checkSnapshotName(snapshot).then(function (response) {
                if(true==response.data){
                    return false;
                }else{
                    return true;
                }
            });
        };

        $scope.commit = function () {
            $scope.ok(vm.snapModel);
        };



    }]);