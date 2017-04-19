/**
 * Created by eayun on 2016/4/18.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('CloudhostSnapshotCreateCtrl', ['$scope','volume','SnapshotService', function ($scope,volume,SnapshotService) {
        var vm = this;
        vm.snapModel = {};
        vm.snapModel.dcId=volume.dcId;
        vm.snapModel.prjId=volume.prjId;
        vm.snapModel.volId=volume.volId;



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