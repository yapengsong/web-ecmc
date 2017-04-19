/**
 * Created by eayun on 2016/3/28.
 */
'use strict'

angular.module('eayun.workorder')
    .controller('WorkorderAddCtrl', ['$state','eayunModal', 'WorkorderService', 'toast', 'SysCode','loginInfo', function ($state,eayunModal, WorkorderService, toast, SysCode,loginInfo) {
        var vm = this;
        loginInfo.getSessionInfo().then(function(session){
            vm.user=session.user;
        });
        var cusId=null;
        var userId=null;
        //获取所有客户
        WorkorderService.getAllCustomerList().then(function (response) {
            vm.allCustomerList = response.data;
        });
        vm.queryWorkorderList = {};

        //获取类别

        WorkorderService.getDataTree('0007001002').then(function(response){
            vm.queryWorkorderList.workTypeList = response.data;
        });

        //获取责任人
        WorkorderService.getWorkHeadList("N",'0007001002').then(function(response){
            vm.queryWorkorderList.workHeadUserList=response.data;
        });
        //获取级别
        WorkorderService.getDataTree("0007001001").then(function(response){
            vm.queryWorkorderList.workLevelList=response.data;
        });


        //根据客户ID获取属于该客户的所有用户
        vm.findUserByCusId = function (cusId) {
            WorkorderService.findUserByCusId(cusId).then(function (response) {
                vm.allUsers = response.data;
            });
        };

        //根据用户Id获取该用户的手机号和邮箱
        vm.changeUserMessage = function (userName) {
            if(userName==null || userName==""){
                vm.workorder.workPhone = null;
                vm.workorder.workEmail = null;
                return;
            }
            angular.forEach(vm.allUsers,function(value,key){
                if(userName ==value.userAccount){
                    userId=value.userId;
                    WorkorderService.findUserByUserId(value.userId).then(function(response){
                        if(response.data.isMailValid){
                            vm.workorder.workEmail = response.data.userEmail;
                        }
                        if(response.data.isPhoneValid){
                            vm.workorder.workPhone = response.data.userPhone;
                        }
                        return false;
                    });
                }
            });
        };

        vm.checkEmail = function (email) {
            var mailTest = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
            if (email.match(mailTest)) {
                return true;
            } else {
                return false;
            }
        };

        //添加工单
        vm.addWorkOrder = function (workorder) {
            workorder.workCreUser = vm.user.id;
            workorder.workCreRole = '1';
            workorder.workFalg="0";
            workorder.sendMesFlag = '0';
            workorder.workFalg = '0';
            workorder.workPhoneTime = '2';
            workorder.workEcscFalg = '0';
            workorder.workComplain = '0';
            workorder.workState = '1';
            workorder.workCreUserName =vm.user.name;
            workorder.workApplyUserName=workorder.workApplyUser;
            var addModel=angular.copy(workorder);
            addModel.applyCustomer=cusId==null?vm.workorder.applyCustomer:cusId;
            addModel.workApplyUser=userId==null?vm.workorder.workApplyUser:userId;
            WorkorderService.addWorkOrder(addModel).then(function (response) {
                if (response.respCode == SysCode.success) {
                    toast.success('创建成功!');
                } else {
                    toast.error('创建工单失败!');
                }
                $state.go('app.workorder');
            });
        };
        vm.changeCusOrg = function(cusOrg){
            if(cusOrg!=null && cusOrg!=""){
                vm.workorder.workApplyUser="";
                vm.workorder.workPhone="";
                vm.workorder.workEmail="";
                angular.forEach(vm.allCustomerList,function(value,key){
                    if(cusOrg==value.cusOrg){
                        cusId=value.cusId;
                        WorkorderService.findUserByCusId(value.cusId).then(function (response) {
                            vm.allUsers = response.data;
                            return false;
                        });
                    }
                });
            }else{
                vm.workorder.workApplyUser=null;
                vm.workorder.workPhone = null;
                vm.workorder.workEmail = null;
            }
        };

    }]);