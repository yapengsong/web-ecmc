
'use strict';

angular.module('eayun.image')
    .controller('GloDetailCtrl', ['$scope','SysCode','GlobalService','imageId',function ($scope,SysCode,GlobalService,imageId) {
        var vm = this;
        vm.item = {};
        GlobalService.getImageById(imageId).then(function (data) {
            if(data.respCode == SysCode.success){
                vm.item = data.data;
                if(null==vm.item.imageDescription||'null'==vm.item.imageDescription){
                    vm.item.imageDescription='';
                }
                vm.color = '';
                if (vm.item.imageStatus == 'ACTIVE'&&vm.item.isUse=='1') {
                    vm.color = 'green';
                }
                else if (vm.item.imageStatus == 'ERROR'||vm.item.isUse=='2'||vm.item.isUse=='0') {
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