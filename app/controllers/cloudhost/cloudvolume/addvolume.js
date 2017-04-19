/**
 * Created by eayun on 2016/4/18.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('CloudhostVolumeCreateCtrl', ['$scope', 'HomeCommonService', 'VolumeService', function ($scope, HomeCommonService, VolumeService) {
        var vm = this;
        vm.volModel = {};

        HomeCommonService.getDcList().then(function (data) {
            vm.dcList = data;
        });

        vm.changeDateCenter= function (_dcId) {
            vm.volModel.dcId = _dcId;
            vm.prjList = {};
            vm.volModel.prjId = '';
            HomeCommonService.getPrjByDcId(_dcId).then(function (data) {
                vm.prjList = data;
            });
        };


        //校验名称格式和唯一性
        vm.checkVolumeName = function (value) {
                if(null==vm.volModel.prjId||'null'==vm.volModel.prjId||''==vm.volModel.prjId){
                     return true;
                }
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
                if(1*value<=2048){
                    return true;
                }
                else{
                    return false;
                }
        };

        //切换项目校验重名
        vm.changePrj=function(){
            $scope.myForm.name.$validate();
        };

        $scope.commit = function () {
            $scope.ok(vm.volModel);
        };
    }]);