/**
 * Created by ZHL on 2016/4/5.
 */
'use strict';

angular.module('eayun.sysdatatree')
    .controller('SysDataTreeSortCtrl', ['$scope','sysdatatreeService','eayunModal','SysCode','toast','parentId',function ($scope,sysdatatreeService,eayunModal,SysCode,toast,parentId) {
        var vm = this;
        vm.parentId = parentId;
        vm.childrenList = {};
        sysdatatreeService.getDataTreeChildren(vm.parentId).then(function(data){
            if(data.respCode == SysCode.success){
                vm.childrenList = data.data;
            }else{
                eayunModal.error("获取排序列表出错");
            }
        });
        vm.upSort = function(index){
            if(index == 0 ){
                return;
            }else{
                vm.middleModel = {};
                vm.middleModel = vm.childrenList[index];
                vm.childrenList[index] = vm.childrenList[index-1];
                vm.childrenList[index-1] = vm.middleModel;
                vm.doSort();
            }

        };
        vm.downSort = function(index){
            if(index == vm.childrenList.length-1){
                return;
            }else{
                vm.middleModel = {};
                vm.middleModel = vm.childrenList[index];
                vm.childrenList[index] = vm.childrenList[index+1];
                vm.childrenList[index+1] = vm.middleModel;
                vm.doSort();
            }
        };
        vm.doSort = function(){
            vm.ids = [];
            vm.sorts = [];
            angular.forEach(vm.childrenList, function (value,key) {
                vm.ids.push(value.nodeId);
                vm.sorts.push(key+1);
            });
            sysdatatreeService.doSort(vm.ids,vm.sorts).then(function(data){
                if(data.respCode == SysCode.success){
                    toast.success("排序成功");
                }else{
                    eayunModal.error("排序出错");
                }
            });
        };
        $scope.commit = function () {
            $scope.ok();
        };

    }]);