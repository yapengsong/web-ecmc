/**
 * Created by Administrator on 2016/4/1.
 */
angular.module('eayun.model')
    .controller('ModelAddCtrl', ['ModelPhysicalService', function (ModelPhysicalService) {
        var vm = this;
        vm.model={};

        /**校验*/
        vm.checkName= function (value) {
            vm.validName=true;
            vm.validNamelength=true;
            ModelPhysicalService.validAddName(value).then(function (data) {
                vm.validName=data;
            });
            if(value.length>50){
                vm.validNamelength=false;
            }
            return vm.validName;
        };
        vm.checkMemory= function (value) {
            var inputFormat=/^[1-9][0-9]{0,3}$/;
            vm.memoryFlag=ModelPhysicalService.check(value,inputFormat);
            return vm.memoryFlag;
        };
        vm.checkCpu= function (value) {
            var inputFormat=/^[1-9][0-9]{0,3}$/;
            vm.cpuFlag=ModelPhysicalService.check(value,inputFormat);
            return vm.cpuFlag;
        };
        vm.checkDisk= function (value) {
            var inputFormat=/^[1-9][0-9]{0,4}$/;
            vm.diskFlag=ModelPhysicalService.check(value,inputFormat);
            return vm.diskFlag;
        };
        vm.checkSpec= function (value) {
            var inputFormat=/^[1-9][0-9]{0,2}$/;
            vm.specFlag=ModelPhysicalService.check(value,inputFormat);
            return vm.specFlag;
        };
    }]);