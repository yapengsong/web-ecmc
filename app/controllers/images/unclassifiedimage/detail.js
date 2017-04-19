
'use strict';

angular.module('eayun.image')
    .controller('CustomDetailCtrl', ['$scope','SysCode','customimageService','imageId',function ($scope,SysCode,customimageService,imageId) {
        var vm = this;
        vm.item = {};
        customimageService.getImageById(imageId).then(function (data) {
            if(data.respCode == SysCode.success){
                vm.item = data.data;
                if('null'==vm.item.imageDescription||null==vm.item.imageDescription){
                    vm.item.imageDescription='';
                }
                vm.color = '';
                if (vm.item.imageStatus == 'ACTIVE') {
                    vm.color = 'green';
                }
                else if (vm.item.imageStatus == 'ERROR') {
                    vm.color = 'gray';
                }
                else if (vm.item.imageStatus == 'SAVING' || vm.item.imageStatus == 'QUEUED'|| vm.item.imageStatus == 'DELETING') {
                    vm.color = 'yellow';
                }
                else {
                    vm.color = 'red';
                }
            }
        });
        $scope.commit = function () {
            $scope.ok();
        };

    }]);