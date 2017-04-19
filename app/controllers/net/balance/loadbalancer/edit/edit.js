/**
 * Created by ZH.F on 2016/4/27.
 */
'use strict';

angular.module('eayun.net')
    .controller('LoadBalancerEditCtrl', ['$scope', 'LoadBalancerService', 'resourcePool', '$http', 'toast', 'eayunModal',
        function ($scope, LoadBalancerService, resourcePool, $http, toast, eayunModal) {
            var vm = this;

            vm.resourcePool = resourcePool;
            if(vm.resourcePool.connectionLimit === 0){
                vm.resourcePool.connectionLimit = null;
            }

            /*检查是否重名*/
            vm.checkPoolName = function () {
                LoadBalancerService.checkPoolName(vm.resourcePool).then(function (response) {
                    vm.checkName = response.data.data;
                });
            };

            vm.checkButton = false;
            /*创建pool的提交*/
            $scope.commit = function () {
                var promise;
                promise = LoadBalancerService.editPool(vm.resourcePool);
                vm.checkButton = true;
                promise.then(function (data) {
                    $scope.ok(data);
                }, function () {
                    vm.checkButton = false;
                });
            };

        }]);