/**
 * Created by Administrator on 2016/4/1.
 */
angular.module('eayun.api')
    .controller('SwitchEditCtrl', ['$interval','eayunModal','ApiLimitService','SysCode','$scope','toast','doType','$state','dcId','apiPhone',
        function ($interval,eayunModal,ApiLimitService,SysCode,$scope,toast,doType,$state,dcId,apiPhone) {
            var vm = this;
            vm.apiPhone = apiPhone;
            vm.promise = null;
            vm.editParams = {
                dcId:dcId,
                code:'',
                operation:doType
            };
            vm.thismodel = {
                second : 60,
                isSend : false
            };
            vm.str = '关闭';
            if('1'==doType){
                vm.str = '开启';
            }

            vm.updateClock = function(){
                vm.thismodel.second--;
                if(vm.thismodel.second <= 0){
                    vm.thismodel.isSend = false;
                    $interval.cancel(vm.promise);
                }
            };
            vm.sendCode = function(){
                vm.thismodel.second = 60;
                vm.promise = $interval(function(){
                    vm.updateClock();
                },1000);
                vm.thismodel.isSend = true;
                ApiLimitService.getCodeForApiSwitch(vm.editParams).then(function (response) {
                },function(){
                    vm.checkPhone();
                });
            };
            $scope.commit = function () {
                ApiLimitService.operationApiSwitch(vm.editParams).then(function(data){
                    if(data.respCode == SysCode.success){
                        toast.success("API"+vm.str +"成功");
                        $scope.ok();
                    }
                },function(){
                    vm.checkPhone();
                });
            };
            vm.checkPhone = function(){
                ApiLimitService.getApiSwitchPhone().then(function (response) {
                    if (response.respCode == SysCode.success) {
                        vm.apiPhone = response.data;
                        vm.thismodel.isSend = false;
                        $interval.cancel(vm.promise);
                    };
                    if(null==vm.apiPhone||''==vm.apiPhone){
                        eayunModal.error('请先绑定手机号！');
                        $scope.cancel();
                    }
                });
            }
        }])