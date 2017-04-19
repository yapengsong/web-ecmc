/**
 * Created by eayun on 2016/3/24.
 */
'use strict';

angular.module('eayun.customer')
    .controller('CustomerManageCtrl', ['$state','eayunModal', 'CustomerService','toast', 'SysCode', function ($state,eayunModal, CustomerService,toast, SysCode) {
        var vm = this;
        vm.uncreatedCusNum = 0;

        vm.cusStates = [{
            id: '1',
            name: '冻结'
        }, {
            id: '0',
            name: '活跃'
        }];

        vm.queryByCusState = function(){
            vm.cusTable.api.draw();
        }

        vm.search = '';
        vm.options = {
            placeholder: "请输入客户名称搜索",
            searchFn: function () {
                vm.cusTable.api.draw();
            }
        };

        vm.cusTable = {
            source: '/api/ecmc/customer/getcustomerlist',
            api: {},
            getParams: function(){
                return {
                    searchKey: vm.search ? vm.search : '',
                    isBlocked : vm.cusState
                };
            }
        };

        vm.manageProject = function (cusId) {
            $state.go('app.customer.detail.cusandprojects',{cusId:cusId});
        };

        vm.cusOverview=function(){
            CustomerService.customerOverview().then(function (response) {
                vm.customerOverview = response;
            });
        }

        vm.cusOverview();

        //vm.customerOverview = CustomerService.customerOverview();

        vm.add = function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '创建客户及项目',
                width: '710px',
                templateUrl: 'controllers/customer/manage/add/add.html',
                controller: 'CustomerManageAddCtrl',
                controllerAs:'add',
                resolve: {
                    customer:function(){
                        return null;
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

                    switch (response.respCode){
                        case SysCode.error:
                            eayunModal.error("创建客户"+custoemr.cusOrg+"及项目失败");
                            return ;
                        case SysCode.success:
                            toast.success("创建客户"+custoemr.cusOrg+"及项目成功");
                            vm.cusTable.api.draw();
                            vm.cusOverview();
                            return ;
                        default:
                            vm.cusTable.api.draw();
                            vm.cusOverview();
                            return ;
                    }
                });
            })
        };

        vm.edit = function (_cusId) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '编辑客户',
                width: '800px',
                templateUrl: 'controllers/customer/manage/edit/edit.html',
                controller: 'CustomerManageEditCtrl',
                controllerAs:'cus',
                resolve: {
                    customer:function(){
                        return  CustomerService.getCustomerById(_cusId).then(function(response){
                            return response.data;
                        });
                    }
                }
            });
            result.then(function (customer) {
                CustomerService.editCustomer(customer).then(function(response){
                    switch (response.respCode){
                        case SysCode.error:
                            eayunModal.error("编辑客户"+customer.cusOrg+"失败");
                            return ;
                        case SysCode.success:
                            toast.success("编辑客户"+customer.cusOrg+"成功");
                            vm.cusTable.api.draw();
                            return ;
                        default:
                            vm.cusTable.api.draw();
                    }
                });
            })
        };

        vm.overview={show: true};

        vm.toggle = function (){
            vm.overview.show=!vm.overview.show;
        }

        CustomerService.getUncreatedCusNum().then(function (response) {
            vm.uncreatedCusNum = response.data;
        });

        vm.showNotCreatedCus = function(){
            $state.go("app.customer.uncreatedcus");
        }
    }]);
