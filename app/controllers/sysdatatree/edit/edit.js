/**
 * Created by ZHL on 2016/4/5.
 */
'use strict';

angular.module('eayun.sysdatatree')
    .controller('SysDataTreeEditCtrl', ['$scope','sysdatatreeService','eayunModal','item',function ($scope,sysdatatreeService,eayunModal,item) {
        var vm = this;
        vm.item = angular.copy(item,{});
        $scope.commit = function () {
            vm.item.nodeName = vm.item.nodeNameZh;
            $scope.ok(vm.item);
        };
    }]);