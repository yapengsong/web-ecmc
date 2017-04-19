/**
 * Created by Administrator on 2016/8/17 0017.
 */
/**
 * Created by eayun on 2016/3/24.
 */
'use strict'

angular.module('eayun.customer')
    .controller('CustomerDetailCtrl', ['eayunModal', '$state', 'CustomerService', '$stateParams', 'toast', 'SysCode', 'eayunStorage',
        function (eayunModal, $state, CustomerService, $stateParams, toast, SysCode, eayunStorage) {
        var vm = this;
        vm.resetCusPass = "重置密码";

        function refreshCustomer(){
            CustomerService.getCustomerById($stateParams.cusId).then(function (response) {
                vm.customerDetail = response.data;
            });
        }

        refreshCustomer();

        vm.detailTable = {
            source: '/api/ecmc/project/getprojectbycustomer',
            api: {},
            getParams: function () {
                return {
                    cusId: $stateParams.cusId
                }
            }
        };

        vm.expireResourceTable = {
            source: '/api/ecmc/customer/getexpireresourcelist',
            api: {},
            getParams: function () {
                return {
                    cusId: $stateParams.cusId
                }
            }
        };

        vm.editCustomer = function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '编辑客户',
                width: '800px',
                templateUrl: 'controllers/customer/manage/edit/edit.html',
                controller: 'CustomerManageEditCtrl',
                controllerAs: 'cus',
                resolve: {
                    customer: function () {


                        vm.customerDetail.custypefag=vm.customerDetail.custypefag+''
                        if(vm.customerDetail.custypefag!=''){
                            vm.customerDetail.custypefag=Number(vm.customerDetail.custypefag);

                        }else{
                            vm.customerDetail.custypefag='10';
                        }

                        console.info(vm.customerDetail);
                        return angular.copy(vm.customerDetail);
                    }
                }
            });
            result.then(function (customer) {

                customer.cus_type=customer.custypefag;
                CustomerService.editCustomer(customer).then(function (response) {
                    switch (response.respCode) {
                        case SysCode.error:
                            eayunModal.error("创建客户失败");
                            return;
                        case SysCode.success:
                            toast.success("修改客户成功");
                            CustomerService.getCustomerById($stateParams.cusId).then(function (response) {
                                vm.customerDetail = response.data;
                            });
                            return;
                        default:
                            CustomerService.getCustomerById($stateParams.cusId).then(function (response) {
                                vm.customerDetail = response.data;
                            });
                            return;
                    }
                });
            })
        };

        vm.createProject = function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '创建项目',
                width: '730px',
                templateUrl: 'controllers/customer/project/project.html',
                controller: 'CustomerProjectCtrl',
                controllerAs: 'prj',
                resolve: {
                    project: function () {
                        var prj = angular.copy(vm.customerDetail);
                        return CustomerService.getPrjName(prj.cusOrg).then(function (response) {
                            prj.prjName = response.data;
                            return prj;
                        });
                    },
                    dcList: function () {
                        return CustomerService.getDcList().then(function (response) {
                            return response.data;
                        });
                    }
                }

            })
            result.then(function (project) {
                CustomerService.createProjectOnly(project).then(function (response) {
                    switch (response.respCode) {
                        case SysCode.error:
                            eayunModal.error("创建项目" + project.prjName + "失败");
                            return;
                        case SysCode.success:
                            toast.success("创建项目" + project.prjName + "成功");
                            vm.detailTable.api.draw();
                            return;
                        default:
                            vm.detailTable.api.draw();
                            return;
                    }
                });
            });

        };

        //冻结账户
        vm.blockCustomer = function (cusId, cusOrg) {
            eayunModal.confirm("确定冻结客户" + cusOrg + "的全部账号？").then(function () {
                CustomerService.blockCustomer(cusId).then(function (response) {
                    switch (response.respCode) {
                        case SysCode.error:
                            eayunModal.error(response.message);
                            return;
                        case SysCode.success:
                            toast.success("冻结账号成功！");
                            vm.refreshPage(cusId);
                            vm.detailTable.api.draw();
                            return;

                    }
                });
            });
        };
        //刷新客户详情页表头
        vm.refreshPage = function(cusId){
            CustomerService.getCustomerById($stateParams.cusId).then(function (response) {
                vm.customerDetail = response.data;
            });
        };
        //解冻客户
        vm.unblockCustomer = function (cusId, cusOrg) {
            eayunModal.confirm("确定恢复客户" + cusOrg + "的全部账号？").then(function () {
                CustomerService.unblockCustomer(cusId).then(function (response) {
                    switch (response.respCode) {
                        case SysCode.error:
                            eayunModal.error(response.message);
                            return;
                        case SysCode.success:
                            toast.success("恢复账号成功！");
                            vm.refreshPage(cusId);
                            vm.detailTable.api.draw();
                            return;

                    }
                });
            });
        };
        //调整客户金额
        vm.adjustAccountMoney = function (cusId) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '调整账户资金',
                width: '600px',
                templateUrl: 'controllers/customer/manage/adjustmoney/adjustmoney.html',
                controller: 'adjustAccountMoneyCtrl',
                controllerAs: 'adjust',
                resolve: {
                    monMoney: function () {
                        return CustomerService.getAccountBalance(cusId).then(function (response) {
                            return response.toFixed(2);
                        });
                    },
                    cusId: function () {
                        return cusId;
                    }
                }
            });
            result.then(function (RecordBean) {
                CustomerService.changeBalance(RecordBean).then(function (response) {
                    switch (response.respCode) {
                        case SysCode.error:
                            eayunModal.error("调整账户资金失败");
                            return;
                        case SysCode.success:
                            toast.success("调整账户资金成功");
                            refreshCustomer();
                            return;
                        default:
                            return;
                    }
                });
            })
        };
            //API访问限制
            vm.apiRestrict = function (cusId,cusOrg) {
                var result = eayunModal.open({
                    showBtn: false,
                    title: '编辑客户访问次数',
                    width: '600px',
                    templateUrl: 'controllers/customer/api/apirestrict.html',
                    controller: 'cusApiRestrictCtrl',
                    controllerAs: 'apiRestrict',
                    resolve: {
                        cusId: function () {
                            return cusId;
                        },
                        cusOrg: function () {
                            return cusOrg;
                        }
                    }
                }).result;
                result.then(function (actionsList) {
                    CustomerService.updateApiRequestCount(actionsList,cusId,cusOrg).then(function (response) {
                        switch (response.respCode) {
                            case SysCode.error:
                                eayunModal.error("编辑失败");
                                return;
                            case SysCode.success:
                                toast.success("编辑成功");
                                return;
                            default:
                                return;
                        }
                    });
                },function(){

                })
            };


        vm.editProject = function (prjId) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '修改项目',
                width: '730px',
                templateUrl: 'controllers/customer/project/project.html',
                controller: 'CustomerProjectCtrl',
                controllerAs: 'prj',
                resolve: {
                    project: function () {
                        return CustomerService.getPrjByPrjId(prjId).then(function (response) {
                            return response.data;
                        });
                    },
                    dcList: function () {
                        return CustomerService.getDcList().then(function (response) {
                            return response.data;
                        });
                    }
                }
            });
            result.then(function (project) {
                CustomerService.modifyProject(project).then(function (response) {
                    switch (response.respCode) {
                        case SysCode.error:
                            eayunModal.error("修改项目失败");
                            return;
                        case SysCode.success:
                            toast.success("修改项目成功");
                            vm.detailTable.api.draw();
                            return;
                        default:
                            vm.detailTable.api.draw();
                            return;
                    }

                });
            })
        };
        vm.resetCusAdminPass = function () {
            eayunModal.confirm('确定重置密码吗?').then(function () {
                vm.resetCusPass = "密码重置中";
                CustomerService.resetCusAdminPass(vm.customerDetail.cusId).then(function (response) {
                    toast.success("密码重置成功");
                    vm.resetCusPass = "重置密码";
                });
            }, function () {

            });

        }


        vm.pool = function (prjId) {
            eayunModal.dialog({
                showBtn: false,
                title: '资源池',
                width: '1000px',
                templateUrl: 'controllers/customer/pool/pool.html',
                controller: 'CustomerPoolCtrl',
                controllerAs: 'pool',
                resolve: {
                    pool: function () {
                        return CustomerService.getProjectPool(prjId).then(function (response) {
                            return response.data;
                        })
                    }
                }
            });
        };
        vm.datailProject = function (prjId) {
            eayunModal.dialog({
                showBtn: false,
                title: '项目详情',
                width: '730px',
                templateUrl: 'controllers/customer/project/detailproject.html',
                controller: 'CustomerProjectCtrl',
                controllerAs: 'prj',
                resolve: {
                    project: function () {
                        return CustomerService.getPrjByPrjId(prjId).then(function (response) {
                            return response.data;
                        });
                    },
                    dcList: function () {
                        return {};
                    }
                }
            });
        };
        vm.goToVmList = function () {
            $state.go('app.cloudhost');
        };
        vm.goToNetList = function () {
            $state.go('app.net');
        };
        vm.goToAlarmList = function () {
            $state.go('app.warning');
        };
        vm.statistic = function (prjId,dcId) {
            $state.go('app.customer.statistic', {prjId: prjId,dcId:dcId,cusId:$stateParams.cusId});
        };
        vm.deleteProject = function (prjName, prjId) {
            eayunModal.confirm("确认删除项目" + prjName + "？").then(function () {
                CustomerService.deleteProject(prjId).then(function (response) {
                    switch (response.respCode) {
                        case SysCode.error:
                            eayunModal.error("项目下存在" + response.data + ",请先进行资源删除操作！");
                            return;
                        case SysCode.success:
                            toast.success("删除项目成功");
                            vm.detailTable.api.draw();
                            return;
                        default:
                            toast.success("删除项目成功");
                            vm.detailTable.api.draw();
                            return;
                    }
                });
            });
        };

        //调整信用额度
        vm.modifyCreditLines = function(){
            var result = eayunModal.dialog({
                showBtn: false,
                title: '设置信用额度',
                width: '500px',
                templateUrl: 'controllers/customer/detail/creditlines/modifycreditlines.html',
                controller: 'CreditLinesCtrl',
                controllerAs: 'credit',
                resolve: {
                    cusId: function(){
                        return $stateParams.cusId;
                    },
                    creditLines: function(){
                        console.info(Number(vm.customerDetail.creditLines).toFixed(2));
                        return vm.customerDetail.creditLines;
                    }
                }
            });
            result.then(function (creditLines) {
                CustomerService.modifyCreditLines($stateParams.cusId, creditLines)
                    .then(function (response) {
                        switch (response.respCode) {
                            case SysCode.error:
                                eayunModal.error("设置信用额度失败！");
                                return;
                            case SysCode.success:
                                toast.success("设置信用额度成功！");
                                refreshCustomer();
                                return;
                            default:
                                toast.success("设置信用额度成功！");
                                refreshCustomer();
                                return;
                        }
                    })
            });
        }

        vm.toWorkorderList = function(cusName){
            //eayunStorage.persist("workorderFlag","0");
            $state.go("app.workorder.tab.unfinished",{applyCustomer:cusName, workorderFlag:"0"});
        }
    }]);