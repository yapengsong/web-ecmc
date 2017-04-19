/**
 * Created by eayun on 2016/4/9.
 */
'use strict'

angular.module('eayun.customer')
    .controller('CustomerManageAddCtrl', ['$scope','dcList','customer','cusOrgList','CustomerService','SysCode', 'eayunModal',
        function ($scope,dcList,customer,cusOrgList,CustomerService,SysCode, eayunModal) {
        var vm=this;
        vm.dcList = dcList;
        vm.cusOrgList=cusOrgList;
        vm.isDisabled=false;
        vm.disableQtSelector = true;
      
        if(customer==null){//新建
            $scope.showDis=false;
        }else{//工单调用
            $scope.showDis=true;
            vm.customer=angular.copy(customer,{});
        }

        $scope.step = 'customer';
        $scope.back = function () {
            $scope.step = 'customer';
        };

        $scope.next = function () {
            if(vm.customer==null){
                vm.customer={};
            }
            CustomerService.getPrjName(vm.customer.cusOrg).then(function(response){
                vm.customer.imageCount = 10;//自定义镜像数量默认为10
                vm.customer.prjName=response.data;
            });
            $scope.step = 'project';
        };
        vm.changeCusOrg = function(cusOrg){
            vm.isDisabled=false;
            if($scope.showDis){//工单调用--验证唯一性
                CustomerService.checkCusOrg(cusOrg).then(function(response){
                    switch (response.respCode){
                        case SysCode.error:
                            vm.checkCusOrgFlag= true;
                            return;
                        case SysCode.success:
                            vm.checkCusOrgFlag=false;
                            return;
                        default:
                            vm.checkCusOrgFlag=false;
                            return;
                    }

                });
            }else{//创建
                angular.forEach(vm.cusOrgList,function(value,key){
                    if(cusOrg==value.cusOrg){
                        CustomerService.getCustomerById(value.cusId).then(function(response){
                            response.data.cusNumber=response.data.cusNumber.split("Admin")[0];
                            vm.customer=response.data;
                            vm.isDisabled=true;
                            vm.checkCusNumberFlag=false;
                            vm.checkCusEmailFlag=false;
                            vm.checkCusPhoneFlag=false;
                            vm.checkCusCpnameFlag=false;
                            return false;
                        });
                    }else{
                        if(vm.customer.cusId!=null && vm.customer.cusId != ""){
                            vm.customer={"cusOrg":cusOrg};
                        }
                    }
                });
            }
        };

        vm.checkCusPhone=function(cusPhone){
            if(cusPhone=="" || cusPhone==null){
                return;
            }
            CustomerService.checkCusPhone(cusPhone, vm.customer.cusId||"").then(function(response){
                switch (response.respCode){
                    case SysCode.error:
                        vm.checkCusPhoneFlag=true;
                        return;
                    case SysCode.success:
                        vm.checkCusPhoneFlag=false;
                        return;
                    default:
                        vm.checkCusPhoneFlag=false;
                        return;
                }
            })
        };
        vm.checkCusEmail=function(cusEmail){
            if(cusEmail=="" || cusEmail==null){
                return ;
            }
            CustomerService.checkCusEmail(cusEmail, vm.customer.cusId||"").then(function(response){
                console.info(response);
                switch (response.respCode){
                    case SysCode.error:
                        vm.checkCusEmailFlag=true;
                        return;
                    case SysCode.success:
                        vm.checkCusEmailFlag=false;
                        return;
                    default:
                        vm.checkCusEmailFlag=false;
                        return;
                }
            })

        };

        vm.checkCusCpname=function(cusCpname){
            if(cusCpname=="" || cusCpname==null){
                return ;
            }
            CustomerService.checkCusCpname(cusCpname, vm.customer.cusId||"").then(function(response){
                switch (response.respCode){
                    case SysCode.error:
                        vm.checkCusCpnameFlag=true;
                        return;
                    case SysCode.success:
                        vm.checkCusCpnameFlag=false;
                        return;
                    default:
                        vm.checkCusCpnameFlag=false;
                        return;
                }
            })
        };

        vm.checkCusNumber=function(cusAdmin){
            if(cusAdmin=="" || cusAdmin==null){
                return ;
            }
            CustomerService.checkCusAdmin(cusAdmin+"Admin", vm.customer.cusId||"").then(function(response){
                switch (response.respCode){
                    case SysCode.error:
                        vm.checkCusNumberFlag=true;
                        return;
                    case SysCode.success:
                        vm.checkCusNumberFlag=false;
                        return;
                    default:
                        vm.checkCusNumberFlag=false;
                        return;

                }
            });
        };
        vm.changeNetCount=function(){
            vm.customer.routeCount=vm.customer.netWork;
        };
        $scope.commit = function (){
            $scope.ok(vm.customer);
        };

        vm.checkPrjInDc=function(dcId, cusId){
            CustomerService.checkPrjInDc(dcId, cusId).then(function (response) {
                vm.dcCanBeUsed = !response.data;
            });
        };

        function getQtTemplates(){
            CustomerService.getQtTemplateList().then(function(response){
                if(response.data.length > 0){
                    vm.disableQtSelector = false;
                    vm.qtTemplateList = {};
                    vm.qtTemplateList = response.data;
                }else{
                    vm.disableQtSelector = true;
                }
            });
        }

        getQtTemplates();

        vm.refreshTemplate = function(){
            if(vm.showTemSelector){
                getQtTemplates();
                vm.qtTemplateId = null;
            }
        }

        vm.selectQtTemplate = function(){
            CustomerService.getQtTemplateById(vm.qtTemplateId).then(function(response){
                if(response.data){
                    applyQtTemplate(response.data);
                }else{
                    vm.refreshTemplate();
                    eayunModal.error("该模板已被删除，请重新选择！");
                }
            })
        };

        function applyQtTemplate(qtTemplate) {
            vm.customer.cpuCount = qtTemplate.cpuCount;
            vm.customer.memory = qtTemplate.memory;
            vm.customer.hostCount = qtTemplate.hostCount;
            vm.customer.diskCount = qtTemplate.diskCount;
            vm.customer.diskSnapshot = qtTemplate.diskSnapshot;
            vm.customer.diskCapacity = qtTemplate.diskCapacity;
            vm.customer.snapshotSize = qtTemplate.snapshotSize;
            vm.customer.countBand = qtTemplate.countBand;
            vm.customer.netWork = qtTemplate.netWork;
            vm.customer.subnetCount = qtTemplate.subnetCount;
            vm.customer.outerIP = qtTemplate.outerIP;
            vm.customer.safeGroup = qtTemplate.safeGroup;
            vm.customer.quotaPool = qtTemplate.quotaPool;
            vm.customer.smsCount = qtTemplate.smsCount;
            vm.customer.countVpn = qtTemplate.countVpn;
            vm.customer.portMappingCount = qtTemplate.portMappingCount;
            vm.customer.imageCount = qtTemplate.imageCount;
        }

        vm.checkSGNum = function () {
            if(vm.customer.safeGroup<3){
                vm.customer.safeGroup = 3;
            }
        }

    }]);