'use strict';

angular.module('eayun.image')
    .controller('MarketDescEditCtrl', ['$scope','SysCode','$modalInstance','marketimageService','item','HomeCommonService',function ($scope,SysCode,$modalInstance,marketimageService,item,HomeCommonService) {
        console.info('controller');
        var vm = this;

        vm.item = angular.copy(item,{});

       // console.info(scope.content);

        vm.cancel = function () {
            $modalInstance.dismiss();
        };


        vm.commit = function () {
            console.info(vm.item.marketimageDepict);
            $modalInstance.close(vm.item);
        };
    }]);