/**
 * Created by eayun on 2016/3/25.
 */
'use strict'

angular.module('eayun.workorder')
    .controller('WorkorderOperationCtrl', ['$state', 'WorkorderService','loginInfo',function ($state,WorkorderService,loginInfo) {
        var vm = this;
        vm.queryWorkorderList = {};

        if(loginInfo.hasUIPermission("workorder_find_special")&& !loginInfo.hasUIPermission("workorder_update")){//商务
            vm.parentId='0007001003';
        }else if((loginInfo.hasUIPermission("workorder_find_common")||loginInfo.hasUIPermission("workorder_accept")) && !loginInfo.hasUIPermission("workorder_update")){
            //客服或者运维
            vm.parentId='0007001002';
        }else{
            vm.parentId='0007001003,0007001002';
        }
        getWorkType(vm.parentId);
        //获取类别
        function getWorkType(parId){
            WorkorderService.getDataTree(parId).then(function(response){
                vm.queryWorkorderList.workTypeList = response.data;
            });
            //获取责任人
            WorkorderService.getWorkHeadList("N",vm.parentId).then(function(response){
                vm.queryWorkorderList.workHeadUserList=response.data;
            });
        };



        vm.operation={};
        vm.operation.preiodType='week';

        //点击按周 月 年 按钮查询
        vm.period = function(perId) {
            if(null== perId||''==perId){
                vm.operation.preiodType='week';
            }
            vm.operation.preiodType=perId;
            vm.query( vm.operation);
        };

        vm.change=function(type){
            vm.operation.workType=type;
            vm.query( vm.operation);
        };
        //查询所有运维之星
        vm.query=function(operation){
            operation.parentId = vm.parentId;
            WorkorderService.countAllUserAcceptWorkOrder(operation).then(function (response) {
                vm.workorderDoneList = response.data;
            });
        };
        vm.query(vm.operation);

        //查询指定运维中心
        vm.countUserAcceptWorkorder=function(headUserId){
            $state.go('app.workorder.tab.star.personal',{headUser :headUserId});
        };

    }]);