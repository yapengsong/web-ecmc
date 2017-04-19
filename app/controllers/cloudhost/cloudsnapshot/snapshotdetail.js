/**
 * Created by eayun on 2016/4/25.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('CloudhostSnapshotDetailCtrl', ['$stateParams','snapshot','SnapshotService', 'eayunModal','SysCode', 'toast', function ($stateParams,snapshot,SnapshotService, eayunModal,SysCode, toast) {
        var vm = this;
        vm.snapModel = snapshot;
        if(null==vm.snapModel.snapDescription||'null'==vm.snapModel.snapDescription){
            vm.snapModel.snapDescription='';
        }
        vm.snapStatusClass='';
        //快照状态
        var getSnapshotStatus = function () {
            vm.snapStatusClass= '';
            if(vm.snapModel.chargeState != '0') {
                vm.snapStatusClass=  'gray';
                return ;
            }
            if(vm.snapModel.snapStatus&&vm.snapModel.snapStatus=='AVAILABLE'){
                vm.snapStatusClass=  'green';
            }
            else if(vm.snapModel.snapStatus=='ERROR'){
                vm.snapStatusClass=  'gray';
            }
            else if(vm.snapModel.snapStatus=='CREATING'||vm.snapModel.snapStatus=='DELETING' || vm.snapModel.snapStatus == 'RESTORING'){
                vm.snapStatusClass=  'yellow';
            }
        };

        getSnapshotStatus();

        vm.commit = function () {
            eayunModal.confirm('确认保存？').then(function () {
                $scope.ok(vm.snapModel);
            }, function () {
                // console.info('取消');
            });
        };

    }]);