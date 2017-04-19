/**
 * Created by eayun on 2016/4/9.
 */
'use strict'

angular.module('eayun.customer')
    .controller('adjustAccountMoneyCtrl', ['$scope','CustomerService','SysCode','monMoney','cusId', function ($scope,CustomerService,SysCode,monMoney,cusId) {
        var vm = this;
        vm.monMoney = monMoney;
        vm.RecordBean = {};
        vm.RecordBean.cusId = cusId;
        vm.RecordBean.inout = 'income';
        vm.RecordBean.rechargeType = 'recharge';

        $scope.commit = function (){
            $scope.ok(vm.RecordBean);
        }

        vm.formValid = false;
        //校验是否选择合同编号
        vm.changeCheckContract = function(RecordBean){
            if(RecordBean.isCheck){
                vm.checkContract(vm.RecordBean);
                if(RecordBean.monContract == null){
                    vm.formValid = false;
                }
            }else{
                vm.RecordBean.monContract=null;
                vm.isflag=true;
            }
        }

        vm.isflag=true;
        vm.checkContract = function(RecordBean){
            if(RecordBean.monContract == undefined||RecordBean.monContract == null){
                vm.isflag=false;
                return;
            }else{
                /*var regex=/^[a-zA-Z0-9]([_a-zA-Z0-9]{0,19}[a-zA-Z0-9]){0,1}$/;   此为开头结尾不带下划线*/
                var regex=/^[a-zA-Z0-9_]([_a-zA-Z0-9_]{0,20}){0,1}$/;
                if(!regex.test(RecordBean.monContract)){
                    vm.isflag=false;
                    vm.formValid = true;
                }else{
                    vm.isflag=true;
                }
            }

        }



    }]);