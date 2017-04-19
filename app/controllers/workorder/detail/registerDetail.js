/**
 * Created by eayun on 2016/3/29.
 */
'use strict'

angular.module('eayun.workorder')
    .controller('WorkorderRegisterDetailCtrl', ['$stateParams',  'toast', 'SysCode','CustomerService', 'WorkorderService','eayunModal','$timeout','loginInfo','$state',
        function ($stateParams,toast,SysCode,CustomerService,WorkorderService,eayunModal,$timeout,loginInfo,$state) {
        var vm = this;
        vm.createPrj=false;
        loginInfo.getSessionInfo().then(function (session) {
            vm.user = session.user;
        });

        WorkorderService.findWorkOrderByWorkId($stateParams.workId).then(function (response) {
            vm.workorder = response.data;
            vm.workFalg=response.data.workFalg;

        });

       vm.getWorkFlagList=function(){
           WorkorderService.getWorkFlagList(2).then(function (response) {
               vm.workFalgList = response.data;
           });
       };
        vm.getWorkFlagList();
        WorkorderService.findApplyUserByCusId($stateParams.cusId).then(function (response) {
            vm.applyCustomer = response.data;
        });

        //审核通过
        vm.auditPassWork=function(workorder){
            workorder.userId =vm.user.id;
            workorder.cusReason=vm.applyCustomer.cusReason;
            WorkorderService.auditPassWork(workorder).then(function (response) {
                if (response.respCode == SysCode.success) {
                    vm.workorder=response.data;
                    vm.customer.cusFalg='1';
                    toast.success("工单"+workorder.workTitle+"审核通过!");
                } else {
                    eayunModal.error("工单"+workorder.workTitle+"审核失败");
                }
            });
        };

        //审核不通过
        vm.auditNotPassWork=function(workorder){
            workorder.userId =vm.user.id;
            workorder.cusReason=vm.applyCustomer.cusReason;
            WorkorderService.auditNotPassWork(workorder).then(function (response) {
                if (response.respCode == SysCode.success) {
                    vm.workorder=response.data;
                    vm.customer.cusFalg='2';
                    toast.success("工单"+workorder.workTitle+"审核不通过!");
                } else {
                    eayunModal.error("工单"+workorder.workTitle+"审核失败");
                }
            });
        };
        //受理工单
        vm.accept = function (workorder) {
            workorder.userId =vm.user.id;
            workorder.workHeadUser=vm.user.id;
            workorder.workHeadUserName=vm.user.name;
            WorkorderService.acceptWorkOrder(workorder).then(function (response) {
                if (response.respCode == SysCode.success) {
                    toast.success('受理工单成功!');
                    vm.workorder =response.data;
                    vm.getWorkFlagList();
                    vm.workFalg=response.data.workFalg;
                } else {
                    toast.error('受理工单失败!');
                }
            });
        };
        //创建项目
        vm.createPrject=function(customer){
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '创建客户及项目',
                    width: '710px',
                    templateUrl: 'controllers/customer/manage/add/add.html',
                    controller: 'CustomerManageAddCtrl',
                    controllerAs:'add',
                    resolve: {
                        customer:function(){
                            return customer;
                        },
                        dcList:function(){
                            return CustomerService.getDcList().then(function(response){
                                return response.data;
                            });
                        },
                        cusOrgList:function(){
                            return CustomerService.getAllCustomerOrg().then(function(response){
                                return response.data;
                            })
                        }
                    }
                });
                result.then(function (custoemr) {
                    CustomerService.saveCustomerAndPrj(custoemr).then(function(response){
                        if (response.respCode == SysCode.success) {
                            toast.success('创建客户'+custoemr.cusOrg+'及项目成功!');
                        } else {
                            toast.error('创建客户'+custoemr.cusOrg+'及项目失败!');
                        }

                    });
                })
        };
        //回复工单
        vm.replyWorkorder = function (workorder) {
            vm.showTime=false;
            if(vm.workFalg == vm.workorder.workFalg){
                eayunModal.warning("请改变工单状态");
                return ;
            }
            if ((workorder.workState == '0' ||  workorder.workState == null) && vm.workOrderStatus != vm.workorder.workFalg && workorder.workType == '0007001003001') {
                eayunModal.warning("审核工单后才能解决工单");
                return;
            } else if (vm.workFalg != vm.workorder.workFalg && workorder.workState == '1') {
                eayunModal.confirm("请确认项目已创建成功！").then(function () {
                    addWorkopinion(workorder);
                });
            }else{
                addWorkopinion(workorder);
            }
        };
        function addWorkopinion(workorder) {
            workorder.workFalg = vm.workFalg;
            var workOpinion = new Object();
            workOpinion.workId = workorder.workId;
            workOpinion.opinionContent = workorder.opinionContent;
            workOpinion.flag = workorder.workFalg;
            workOpinion.ecmcCre = '0';
            workOpinion.workEcscFalg = workorder.workEcscFalg;
            workOpinion.creUser = vm.user.id;//当前登录人
            workOpinion.opinionState = null;
            workOpinion.creUserName = vm.user.name;
            workOpinion.replyUserName = workorder.workApplyUserName;
            WorkorderService.addWorkOpinion(workOpinion).then(function (response) {
                switch (response.respCode) {
                    case SysCode.error:
                        eayunModal.error(response.message);
                        return;
                    case SysCode.success:
                        WorkorderService.getWorkOpinionsByWorkId(workorder.workId).then(function (response) {
                            vm.WorkOpinions = response.data;
                        });
                        WorkorderService.findWorkOrderByWorkId(workorder.workId).then(function (response) {
                            console.info(response.data.workFalg);
                            if(response.data.workFalg=='3'){
                                $state.go("app.workorder.tab.finished");
                                return ;
                            }
                            vm.workOrderStatus = response.data.workFalg;
                            vm.workorder = response.data;
                            vm.showTime=true;
                        });
                        return;
                    case SysCode.warning:
                        eayunModal.warning(response.message);
                        return;
                    default:
                        WorkorderService.getWorkOpinionsByWorkId(workorder.workId).then(function (response) {
                            vm.WorkOpinions = response.data;
                        });
                        WorkorderService.findWorkOrderByWorkId(workorder.workId).then(function (response) {
                            vm.workOrderStatus = response.data.workFalg;
                            vm.workorder = response.data;
                        });
                        return;
                }
            });
        }
    }]);