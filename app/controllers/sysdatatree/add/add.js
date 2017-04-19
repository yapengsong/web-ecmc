/**
 * Created by ZHL on 2016/4/5.
 */
'use strict';

angular.module('eayun.sysdatatree')
    .controller('SysDataTreeAddCtrl', ['$scope','sysdatatreeService','eayunModal','parentId',function ($scope,sysdatatreeService,eayunModal,parentId) {
        var vm = this;
        vm.parentId = parentId;
        vm.datatree = {
            parentId : vm.parentId,
            isRoot : '0'
        }
        $scope.commit = function () {
            $scope.ok(vm.datatree);
        };

    }]);