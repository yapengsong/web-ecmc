/**
 * Created by liuzhuangzhuang on 2016/8/30.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('RecycleSnapshotDetailCtrl', ['$stateParams','snapModel', 'eayunModal','SysCode', 'toast', function ($stateParams,snapModel, eayunModal,SysCode, toast) {
        var vm = this;
        vm.snapModel = snapModel;

        vm.getSnapStatusClass = function () {
                if(snapModel.isDeleted == '2' && snapModel.snapStatus != 'DELETING') {
                        vm.snapStatusClass =  'red';
                }else{
                        vm.snapStatusClass =  'yellow';
                }
        };

        vm.getSnapStatusClass();
    }]);