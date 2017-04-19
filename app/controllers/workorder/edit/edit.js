/**
 * Created by eayun on 2016/3/30.
 */
'use strict'

angular.module('eayun.workorder')
    .controller('WorkorderEditCtrl', ['$state','$stateParams','toast', 'SysCode', 'WorkorderService','loginInfo',function ($state,$stateParams,toast,SysCode,WorkorderService,loginInfo) {

        var vm = this;
        loginInfo.getSessionInfo().then(function(session){
            vm.user=session.user;
        });

        WorkorderService.findWorkOrderByWorkId($stateParams.workId).then(function (response) {
            vm.workorder = response.data;
        });

        vm.editWorkorder=function(workorder){
            workorder.userId = vm.user.id;
            if(!loginInfo.hasUIPermission("workorder_edit")) {//管理员
                eayunModal.error('无修改工单权限!');
                return ;
            }
            WorkorderService.editWorkOrder(workorder).then(function (response) {
                if (response.respCode == SysCode.success) {
                    toast.success('修改工单成功!');
                } else {
                    eayunModal.error('修改工单失败!');
                }
                $state.go('app.workorder');
            });
        };

    }]);