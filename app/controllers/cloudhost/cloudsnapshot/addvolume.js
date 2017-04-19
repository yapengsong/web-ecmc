/**
 * Created by eayun on 2016/4/18.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('CloudhostSnapVolCreateCtrl', ['$scope','snapshot', 'VolumeService', function ($scope,snapshot,VolumeService) {
        var vm = this;
        vm.volModel = {};
        vm.volModel.diskFrom="snapshot";
        vm.volModel.volSize=snapshot.snapSize;
        vm.volModel.dcId=snapshot.dcId;
        vm.volModel.prjId=snapshot.prjId;
        vm.volModel.prjName=snapshot.prjName;
        vm.volModel.fromSnapId=snapshot.snapId;
        vm.volModel.dcName=snapshot.dcName;
        vm.minsize=snapshot.snapSize;


        //校验名称格式和唯一性
        vm.checkVolumeName = function (value) {
            var model=vm.volModel;
            model.volName=value;
            return  VolumeService.checkVolName(model).then(function(data){
                if(true==data){
                    return  false;
                }else{
                    return true;
                }
            });
        };


        vm.checkVolumeSize = function (value) {
            if(1*value<=2048&&1*value>=vm.minsize){
                return true;
            }
            else{
                return false;
            }
        };

        $scope.commit = function () {
            $scope.ok(vm.volModel);
        };
    }]);