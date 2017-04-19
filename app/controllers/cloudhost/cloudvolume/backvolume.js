/**
 * Created by eayun on 2016/3/21.
 */
'use strict';

angular.module('eayun.cloudhost')
    .controller('RollBackVolume', ['snapshot', '$scope','eayunModal','$modalInstance',
        function (snapshot, $scope, eayunModal, $modalInstance) {
            $scope.model= angular.copy(snapshot,{});

            $scope.ok = function () {
                $modalInstance.close($scope.model);
            };
            $scope.cancel = function () {
                $modalInstance.close(true);
            }
        }]);