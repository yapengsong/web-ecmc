/**
 * Created by eayun on 2016/4/21.
 */
'use strict'

angular.module('eayun.net')
    .controller('NetExternalEditNetCtrl', ['$scope', 'netModel', 'NetExternal', function ($scope, netModel, NetExternal) {
        var vm = this;

        vm.netModel = angular.copy(netModel);
        vm.checkNetName=function(){
            NetExternal.checkNetName(vm.netModel.netName,vm.netModel.netId,vm.netModel.dcId).then(function(response){
                vm.checkName=response.data;
            });
        }
        $scope.commit = function () {
            $scope.ok(vm.netModel);
        }
    }]);