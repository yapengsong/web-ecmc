/**
 * Created by Administrator on 2016/4/1.
 */
angular.module('eayun.cabinet')
    .controller('CabinetEditCtrl', ['eayunModal','CabinetPhysicalService','model','SysCode', function (eayunModal,CabinetPhysicalService,model,SysCode) {
        var vm = this;
        vm.model=model;
        CabinetPhysicalService.getDataCenter().then(function (data) {
            vm.dcList=data;
        });
        /**改变数据中心下拉框*/
        vm.changeDc= function (dcId) {
            vm.validName=true;
            CabinetPhysicalService.getDataCenterById(dcId,vm.model.id).then(function (data) {
                vm.emptyCapa=data;
                CabinetPhysicalService.validName(vm.model.name,null,dcId,vm.model.id).then(function (data) {
                    vm.validName=data;
                });
            });
        };
        /**校验*/
        vm.checkName= function (value) {
            vm.validName=true;
            var inputFormat=/^[\u4e00-\u9fa5a-zA-Z0-9]([\u4e00-\u9fa5_a-zA-Z0-9\s—-]{0,18}[\u4e00-\u9fa5a-zA-Z0-9]){0,1}$/;
            vm.nameFlag=CabinetPhysicalService.check(value,inputFormat);
            CabinetPhysicalService.validName(value,null,vm.model.dataCenterId,vm.model.id).then(function (data) {
                vm.validName=data;
            });

            return vm.nameFlag;
        };
        vm.checkCapacity= function (value) {
            var inputFormat=/^([1-9]|[1-4]\d|50)$/;
            vm.capacityFlag=CabinetPhysicalService.check(value,inputFormat);

           if(vm.capacityFlag){
               CabinetPhysicalService.capacityCheck(vm.model.id,value).then(function (data) {

                   if(data.data.data){
                       vm.capacityResult=true;
                   }else{
                       vm.capacityResult=false;
                       vm.capacityMsg=data.data.message;
                   }
               });
           }
            return vm.capacityFlag;
        };

        vm.checkNum= function (value) {
            vm.checkEmptyCapa=true;
            vm.numFlag=true;
            vm.validName=true;

            vm.model.cabinetNum=value;
            var inputFormat=/^[1-9][0-9]*$/;
            vm.numFlag=CabinetPhysicalService.check(value,inputFormat);
            if(vm.emptyCapa>=value){
                vm.checkEmptyCapa=false;
                CabinetPhysicalService.validName(vm.model.cabinetName,value,vm.model.dcId,null).then(function (data) {
                    vm.validName=data;
                });
            }else{
                vm.checkEmptyCapa=true;
            }

            return vm.numFlag;
        };
    }]);