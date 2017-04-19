/**
 * Created by eayun on 2016/9/7.
 */
'use strict'
angular.module("eayun.net")
    .controller('DeleteResourceInfo3', ['$scope', 'name', '$modalInstance', function ($scope,  name, $modalInstance) {

        $scope.name = name;
        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
        $scope.commit = function () {
            $modalInstance.close();
        }
    }]);
