/**
 * Created by eayun on 2016/4/9.
 */
'use strict'

angular.module('eayun.customer')
    .controller('cusApiRestrictCtrl', ['$scope','SysCode','cusId','cusOrg','CustomerService','eayunModal','$modalInstance', function ($scope,SysCode,cusId,cusOrg,CustomerService,eayunModal,$modalInstance) {
        var vm = this;
        vm.cusId = cusId;
        vm.cusOrg = cusOrg;

        CustomerService.getApiType().then(function (response) {
            if(response.respCode == SysCode.success){
               vm.apiTypeList=response.data;
               vm.apiType=vm.apiTypeList[0];
               vm.change(vm.apiType);
            }else if(response.respCode == SysCode.error){
                eayunModal.error('获取api类别失败');
            }
        });
        vm.change= function (apiType) {
            CustomerService.getRestrictRequestCount(vm.cusId,apiType.version,apiType.apiType).then(function (response) {
                    vm.actionList=response;
            });
        }
        $scope.commit = function (){
            $modalInstance.close(vm.actionList);
        };
        $scope.cancel = function (){
            $modalInstance.dismiss('cancel');
        };
    }]);