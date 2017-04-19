/**
 * Created by Administrator on 2016/4/1.
 */
angular.module('eayun.api')
    .controller('CheckPhoneCtrl', ['$interval','$state','eayunModal','ApimanageService','SysCode','$scope','toast','phone',
            function ($interval,$state,eayunModal,ApimanageService,SysCode,$scope,toast,phone) {
        var vm = this;
        vm.oldPhone = phone;
        vm.checkParams = {
            code:'',
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
            ApimanageService.sendCode({type:'old'}).then(function (response) {
            });
        };
        $scope.commit = function () {
            ApimanageService.verifyApiPhoneCode({code:vm.checkParams.code}).then(function (response) {
                if (response.respCode == SysCode.success) {
                    if(response.data){
                        $scope.cancel();
                        /**验证码通过，打开填写新号码页面*/
                        var result = eayunModal.dialog({
                            title: '修改手机号码',
                            width: '650px',
                            height: '600px',
                            templateUrl: 'controllers/api/apimanage/editPhone.html',
                            controller: 'EditPhoneCtrl',
                            controllerAs: 'edit',
                            resolve: {
                                logType : function () {
                                    return '1';
                                }
                            }
                        });
                        result.then(function () {
                        },function(){
                        });
                    }else{
                        eayunModal.error("手机验证码不正确，请重新输入！");
                    }
                }
            });
        };
    }])