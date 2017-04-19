/**
 * Created by eayun on 2016/3/25.
 */
'use strict'

angular.module('eayun.workorder')
    .controller('WorkorderFinishedCtrl',  ['$state', 'WorkorderService','loginInfo','parentId', function ($state, WorkorderService,loginInfo,parentId) {
        var vm = this;
        /*WorkorderService.getAllCustomerList().then(function (response) {
            vm.allCustomerList = response.data;
        });*/
        loginInfo.getSessionInfo().then(function(session){
            vm.user=session.user;
        });
        WorkorderService.getWorkHeadList("Y",parentId).then(function(response){
            vm.workHeadUserList=response.data;
        });
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
            source: '/api/ecmc/workorder/getdoneworklist',
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
        /*var cusId="";
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

        //获取类别
        WorkorderService.getDataTree(parentId).then(function(response){
            vm.workTypeList = response.data;
        });


        //获取级别
        WorkorderService.getDataTree("0007001001").then(function(response){
            vm.workLevelList=response.data;
        });

        //获取已完成状态
        WorkorderService.getDoneFlagList().then(function(response){
            vm.workFalgList=response.data;
        });

        vm.queryWorkorderTable = function () {
            vm.workorderTable.api.draw();
        };

        vm.detail = function (workorder) {
            if (workorder.workType == '0007001003002') {
                $state.go('app.workorder.register', {workId: workorder.workId,cusId:workorder.applyCustomer});
            } else {
                $state.go('app.workorder.detail', {workId: workorder.workId});
            }
        };

    }]);