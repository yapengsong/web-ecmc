/**
 * Created by ZHL on 2016/4/5.
 */
'use strict';

angular.module('eayun.sysdatatree')
    .controller('DetailCtrl', ['$scope','item',function ($scope,item) {
        var vm = this;
        vm.item = item;
        $scope.commit = function () {
            $scope.ok();
        };

    }]);