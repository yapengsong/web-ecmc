/**
 * Created by Administrator on 2016/4/1.
 */
angular.module('eayun.center')
    .controller('CenterEditCtrl', ['eayunModal','model','CenterDataService','$scope','SysCode','toast', function (eayunModal,model,CenterDataService,$scope,SysCode,toast) {
        var vm = this;
        vm.model=model;
        /**初始为第一页*/
        vm.pagenumber=1;
        /**上一步*/
        vm.goUp= function () {
            vm.pagenumber=CenterDataService.goUp(vm.pagenumber);

        };
        /**下一步*/
        vm.goDown= function () {
            vm.pagenumber=CenterDataService.goDown(vm.pagenumber);
        };
        /**校验*/
        vm.checkName= function (value) {
            var inputFormat = /^[\u4e00-\u9fa5a-zA-Z0-9_]{1,6}$/;
            vm.nameFlag=CenterDataService.check(value,inputFormat);
            return vm.nameFlag;
        };
        vm.checkDcName= function (value) {

                vm.model.name=value;
                return CenterDataService.nameCheckOfEdit(model);
        };
        /**校验Region标识*/
        vm.checkApiDcCode= function (value) {
            return CenterDataService.apiDcCodeCheck({"dcId":model.id,"apiDcCode":value});
        };
        vm.checkCapacity= function (value) {
            var inputFormat=/^[1-9][0-9]*$/;
            vm.capacityFlag=CenterDataService.check(value,inputFormat);
            return vm.capacityFlag;
        };
        vm.checkAddress= function (value) {
            var inputFormat=/^((http|ftp|https):\/\/)(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})*(\/[a-zA-Z0-9\&%_\./-~-]*)?$/;
            vm.addressFlag=CenterDataService.check(value,inputFormat);
            return vm.addressFlag;
        };
        vm.checkOutnetip= function (value) {
            var inputFormat=/^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})){3}$/;
            vm.outnetipFlag=CenterDataService.check(value,inputFormat);
            return vm.outnetipFlag;
        };
        vm.checkcpuRatio= function (value) {
            var inputFormat=/^[1-9]+[0-9]*$/;
            vm.cpuRatioFlag=CenterDataService.check(value,inputFormat);
            return vm.cpuRatioFlag;
        };
        vm.checkramRatio= function (value) {
            var inputFormat=/^[1-9]+[0-9]*(\.[0-9]+)?$/;
            vm.ramRatioFlag=CenterDataService.check(value,inputFormat);
            return vm.ramRatioFlag;
        };
        vm.checkdiskRatio= function (value) {
            var inputFormat=/^[1-9]+[0-9]*(\.[0-9]+)?$/;
            vm.diskRatioFlag=CenterDataService.check(value,inputFormat);
            return vm.diskRatioFlag;
        };
        vm.checkNatwork= function (value) {
            var inputFormat=/^[1-9]+[0-9]*$/;
            vm.natworkFlag=CenterDataService.check(value,inputFormat);
            return vm.natworkFlag;
        };
        vm.checkNagiosIp= function (value) {
            var inputFormat=/^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})){3}$/;
            vm.nagiosIpFlag=CenterDataService.check(value,inputFormat);
            return vm.nagiosIpFlag;
        };
        vm.ok=function(model){
            CenterDataService.edit(model).then(function (data) {
               // if(data.data){
                    if(data.respCode==SysCode.success){
                        toast.success('编辑数据中心'+model.name+'成功!');
                    }else{
                        toast.error(data.message);
                 }
                    $scope.ok();
             //   }else{
                  //  eayunModal.info(data.message);
             //   }
            });
        };
    }]);