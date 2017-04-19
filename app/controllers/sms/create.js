/**
 * Created by eayun on 2016/6/8.
 */
'use strict'

angular.module('eayun.mailsms')
    .controller('SmsCreateCtrl', ['$scope', 'toast', function ($scope, toast) {
        var vm = this;

        vm.smsModel = {};

        $scope.commit = function () {
            vm.smsModel.mobilesList = vm.mobiles.split(',');
            $scope.ok(vm.smsModel);
        }
    }]);