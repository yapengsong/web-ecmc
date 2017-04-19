/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.ecmc')
    .controller('HomePasswordCtrl', ['$scope', 'AuthService', function ($scope, AuthService) {
        var vm = this;
        $scope.commit = function () {
            AuthService.password(vm.password, vm.newPassword).then(function () {
                $scope.ok();
            }, function (message) {
                vm.error = message;
            });
        };
    }]);