/**
 * Created by eayun on 2016/4/18.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('DeleteSnapshot', ['snapshot','$scope', '$modalInstance',
        function (snapshot, $scope, $modalInstance) {
            $scope.model= angular.copy(snapshot,{});
            $scope.isDeleted = false;
            $scope.isShow = false;
            
            if('0' != $scope.model.chargeState){
                $scope.isDeleted = true;
                $scope.isShow = true;
            }
            $scope.ok = function () {
                if($scope.isDeleted){
                    $scope.model.isDeleted='1';
                }else{
                    $scope.model.isDeleted='2';
                }
                $modalInstance.close($scope.model);
            };
            $scope.cancel = function () {
                $modalInstance.close(true);
            };
    }]);