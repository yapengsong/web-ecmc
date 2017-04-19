/**
 * Created by ZH.F on 2016/4/28.
 */
'use strict';

angular.module('eayun.net')
    .controller('LoadBalancerMemberEditController', ['$scope', 'LoadBalancerService', 'member', '$http', 'toast', 'eayunModal',
        function ($scope, LoadBalancerService, member, $http, toast, eayunModal) {
            var vm = this;

            vm.member = member;

            vm.checkBtn = true;
            /**
             * 确定
             */
            $scope.commit = function (){
                var promise;
                promise = LoadBalancerService.updateMember(vm.member);
                promise.then(function (data) {
                    $scope.ok(data);
                }, function () {
                    vm.checkBtn = false;
                    //eayunModal.error("保存失败", 500);
                });
            };

        }]);