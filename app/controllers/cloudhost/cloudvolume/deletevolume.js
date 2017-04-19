/**
 * Created by eayun on 2016/4/18.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('DeleteVolume', ['volModel','$scope', '$modalInstance',
        function (volModel, $scope, $modalInstance) {

            $scope.model= angular.copy(volModel,{});
            $scope.isShow = false;
            $scope.isDeleted = false;

            if('0' != $scope.model.chargeState){
                $scope.isDeleted = true;
                $scope.isShow = true;
            }
            $scope.ok = function () {
                /*if($scope.isDeSnaps&&$scope.isDeleted){
                    $scope.model.isDeleted='1';
                    $scope.model.isDeSnaps='1';//代表彻底删除快照
                }else if($scope.isDeSnaps&&!$scope.isDeleted){
                    $scope.model.isDeleted='2';
                    $scope.model.isDeSnaps='2';//代表放入回收站
                }else if($scope.isDeleted&&!$scope.isDeSnaps){
                    $scope.model.isDeleted='1';
                    $scope.model.isDeSnaps=null;//代表不删除快照
                }else if(!$scope.isDeleted&&!$scope.isDeSnaps){
                    $scope.model.isDeleted='2';
                    $scope.model.isDeSnaps=null;//代表不删除快照
                }*/
                if($scope.isDeleted){
                    $scope.model.isDeleted = '1';
                }
                else{
                    $scope.model.isDeleted = '2';
                }
                $scope.model.isDeSnaps = null;
                $modalInstance.close($scope.model);
            };
            $scope.cancel = function () {
                $modalInstance.close(true);
            };
    }]);