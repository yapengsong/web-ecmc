/**
 * Created by eayun on 2016/3/25.
 */
'use strict'

angular.module('eayun.workorder')
    .controller('WorkorderUnfinishedCtrl', ['$state', 'toast', 'SysCode', 'WorkorderService', 'loginInfo', 'parentId', 'eayunModal', '$stateParams', 'eayunStorage',
        function ($state, toast, SysCode, WorkorderService, loginInfo, parentId, eayunModal, $stateParams, eayunStorage) {
            var vm = this;
            vm.applyCustomer = $stateParams.applyCustomer ? $stateParams.applyCustomer : '';
            loginInfo.getSessionInfo().then(function (session) {
                vm.user = session.user;
            });
            WorkorderService.getWorkHeadList("N", parentId).then(function (response) {
                vm.workHeadUserList = response.data;
            });

            vm.workFalg = $stateParams.workorderFlag;

            /* WorkorderService.getAllCustomerList().then(function (response) {
             vm.allCustomerList = response.data;
             });
             var cusId="";
             vm.changeCusOrg = function(cusOrg){
             cusId=cusOrg;
             if(cusOrg!=null && cusOrg!=""){
             angular.forEach(vm.allCustomerList,function(value,key){
             if(cusOrg==value.cusOrg){
             cusId=value.cusId;
             }
             });
             }
             };*/
            vm.search = '';
            vm.options = {
                select: [{title: '事件标题'}],
                series: {
                    customer: {
                        multi: true,
                        data: function () {
                            return WorkorderService.getAllCustomerList().then(function (response) {
                                var array = [];
                                angular.forEach(response.data, function (value) {
                                    array.push(value.cusOrg);
                                });
                                return array;
                            });
                        }
                    }
                }
            };

            vm.workorderTable = {
                source: '/api/ecmc/workorder/getnotdoneworklist',
                api: {},
                getParams: function () {
                    return {
                        workTitle: vm.workTitle ? vm.workTitle : '',
                        beginTime: vm.beginTime ? vm.beginTime.getTime() : null,
                        endTime: vm.endTime ? vm.endTime.getTime() : null,
                        applyCustomer: vm.applyCustomer ? vm.applyCustomer : '',
                        workType: vm.workType ? vm.workType : '',
                        workLevel: vm.workLevel ? vm.workLevel : '',
                        workFalg: vm.workFalg ? vm.workFalg : '',
                        workHeadUser: vm.workHeadUser ? vm.workHeadUser : '',
                        workNum: vm.workNum ? vm.workNum : '',
                        workPhone: vm.workPhone ? vm.workPhone : '',
                        workEmail: vm.workEmail ? vm.workEmail : '',
                        cusCpname: vm.cusCpname ? vm.cusCpname : '',
                        parentId: parentId,
                        workCusName : vm.workCusName ? vm.workCusName : ''
                    };
                }
            };


            //获取类别
            //function getWorkType(){
            WorkorderService.getDataTree(parentId).then(function (response) {
                vm.workTypeList = response.data;
            });
            //};


            //获取级别
            WorkorderService.getDataTree("0007001001").then(function (response) {
                vm.workLevelList = response.data;
            });

            //获取未完成状态
            WorkorderService.getNoDoneFlaglist().then(function (response) {
                vm.workFalgList = response.data;
            });
            vm.queryWorkorderTable = function () {
                vm.workorderTable.api.draw();
            };

            //查看工单详情
            vm.detail = function (workorder) {
                if (workorder.workType == '0007001003002') {
                    $state.go('app.workorder.register', {workId: workorder.workId, cusId: workorder.applyCustomer});
                } else {
                    $state.go('app.workorder.detail', {workId: workorder.workId});
                }
            };

            //添加工单
            vm.add = function () {
                $state.go('app.workorder.add');
            };
            //编辑工单
            vm.edit = function (workorder) {
                $state.go('app.workorder.edit', {workId: workorder.workId});
            };

            //受理工单
            vm.accept = function (workorder) {
                workorder.userId = vm.user.id;
                workorder.workHeadUser = vm.user.id;
                workorder.workHeadUserName = vm.user.name;
                WorkorderService.acceptWorkOrder(workorder).then(function (response) {
                    switch (response.respCode) {
                        case SysCode.error:
                            eayunModal.error(response.message);
                            return;
                        case SysCode.success:
                            toast.success('受理工单成功!');
                            if ('0007001003002' == workorder.workType) {
                                $state.go('app.workorder.register', {
                                    workId: workorder.workId,
                                    cusId: workorder.applyCustomer
                                });
                            } else {
                                $state.go('app.workorder.detail', {workId: workorder.workId});
                            }
                            return;
                        case SysCode.warning:
                            eayunModal.warning(response.message);
                            return;
                        default:
                            toast.success("受理工单成功!");
                            return;
                    }
                });
            };

        }]);