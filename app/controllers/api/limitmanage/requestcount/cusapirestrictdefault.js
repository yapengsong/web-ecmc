/**
 * Created by eayun on 2016/4/9.
 */
'use strict'

angular.module('eayun.api')
    .controller('apiRestrictCtrl', ['$scope','SysCode','ApiLimitService','eayunModal','apiType','$modalInstance', function ($scope,SysCode,ApiLimitService,eayunModal,apiType,$modalInstance) {
        var vm = this;

        ApiLimitService.getApiType().then(function (response) {
            if(response.respCode == SysCode.success){
               vm.apiTypeList=response.data;
               var flag=true;
               angular.forEach(vm.apiTypeList, function (value) {
                   if(flag&&value.version==apiType.version&&value.apiType==apiType.apiType){
                       vm.apiType=value;
                       flag=false;
                   }
               });
               vm.change(vm.apiType);
            }else if(response.respCode == SysCode.error){
                eayunModal.error('获取api类别失败');
            }
        });
        vm.change= function (apiType) {
            ApiLimitService.getRestrictRequestCount(apiType.version,apiType.apiType).then(function (response) {
                    vm.actionList=response;
            });
        }
        $scope.commit = function (){
            vm.apiAction={};
            vm.apiAction.list=vm.actionList;
            vm.apiAction.version=vm.apiType.version;
            vm.apiAction.apiTypeName=vm.apiType.apiTypeName;
            vm.apiAction.apiType=vm.apiType.apiType;
            $modalInstance.close(vm.apiAction);
        };
        $scope.cancel= function () {
            $modalInstance.dismiss('cancel');
        }
    }]);