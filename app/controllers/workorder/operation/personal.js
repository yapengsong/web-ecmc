/**
 * Created by eayun on 2016/3/25.
 */
'use strict'

angular.module('eayun.workorder')
    .controller('WorkorderOperationPersonalCtrl', ['$stateParams', 'WorkorderService', 'eayunModal', 'loginInfo',
        function ($stateParams, WorkorderService, eayunModal, loginInfo) {
        var vm = this;
        vm.personal={};
        vm.personal.preiodType='week';
        vm.personal.headUser=$stateParams.headUser;
        if(loginInfo.hasUIPermission("workorder_find_special")&& !loginInfo.hasUIPermission("workorder_update")){//商务
            vm.personal.parentId='0007001003';
        }else if((loginInfo.hasUIPermission("workorder_find_common")||loginInfo.hasUIPermission("workorder_accept")) && !loginInfo.hasUIPermission("workorder_update")){
            //客服或者运维
            vm.personal.parentId='0007001002';
        }else{
            vm.personal.parentId='0007001003,0007001002';
        }

        //点击按周 月 年 按钮查询
        vm.period = function(perId) {
            if(null== perId||''==perId){
                vm.personal.preiodType='week';
            }
            vm.personal.preiodType=perId;
            vm.queryPersonal( vm.personal);
        };

        //查询指定运维之星
        vm.queryPersonal=function(personal){
            WorkorderService.countUserAcceptWorkOrder(personal).then(function (response) {
                vm.personalDoneList = response.data;
            });
        };
        vm.queryPersonal(vm.personal);

    }]);