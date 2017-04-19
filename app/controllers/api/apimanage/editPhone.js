/**
 * Created by Administrator on 2016/4/1.
 */
angular.module('eayun.api')
    .controller('EditPhoneCtrl', ['$interval','eayunModal','ApimanageService','SysCode','$scope','toast','logType','$state',
            function ($interval,eayunModal,ApimanageService,SysCode,$scope,toast,logType,$state) {
        var vm = this;
        vm.promise = null;
        vm.editParams = {
            newPhone:'',
            code:'',
            logType:logType
        };
        vm.thismodel = {
            second : 60,
            isSend : false
        };
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
            ApimanageService.sendCode({newPhone:vm.editParams.newPhone,type:'new'}).then(function (response) {
                if (response.respCode == SysCode.success) {
                }
            });
        };
        $scope.commit = function () {
            ApimanageService.updateApiPhone(vm.editParams).then(function(data){
                if(data.respCode == SysCode.success){
                    toast.success("绑定成功");
                    $scope.cancel();
                    $state.go('^.apimanage',{},{reload:true});
                }else{
                }
            });
        };
    }])