'use strict';

angular.module('eayun.image')
    .controller('CustomEditCtrl', ['$scope','SysCode','customimageService','item',function ($scope,SysCode,customimageService,item) {
        var vm = this;
        vm.item = angular.copy(item,{});
        if(null==vm.item.imageDescription||'null'==vm.item.imageDescription){
            vm.item.imageDescription='';
        }
        vm.isCheckName = true;
        vm.checkName = function(name){
            customimageService.checkName(vm.item).then(function (data) {
                if(data.respCode == SysCode.success){
                    vm.isCheckName = data.data;
                }
            });
        };
        vm.checkName(vm.item);
        $scope.commit = function () {
            $scope.ok(vm.item);
        };
    }]);