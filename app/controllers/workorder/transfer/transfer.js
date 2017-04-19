/**
 * Created by eayun on 2016/4/6.
 */
'use strict'

angular.module('eayun.workorder')
    .controller('WorkorderDetailTurnToOtherCtrl', ['$scope','WorkorderService', 'order', function ($scope,WorkorderService, order) {
        var vm = this;

        WorkorderService.getEcmcAdminAndCpis(null).then(function (response) {
            vm.otherPeoples=[];
            angular.forEach(response.data,function(value,key){
                if(value.id!=order.workHeadUser){
                    vm.otherPeoples.push(value);
                }
            });
        });
        $scope.commit = function (){
            var work=new Object();
            work.workId=order.workId;
            work.headUserId=vm.workHeadUser;
            angular.forEach(vm.otherPeoples,function(value,key){
                if(value.id===vm.workHeadUser){
                    work.headUserName = value.name;
                }
            });
            $scope.ok(work);
        }

    }]);