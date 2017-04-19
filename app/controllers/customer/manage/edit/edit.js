/**
 * Created by eayun on 2016/4/9.
 */
'use strict'

angular.module('eayun.customer')
    .controller('CustomerManageEditCtrl', ['$scope','customer','CustomerService','SysCode', function ($scope,customer,CustomerService,SysCode) {
        var vm = this;

        vm.customer=angular.copy(customer);
        
        $scope.commit = function (){
            $scope.ok(vm.customer);
        }

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
    }]);