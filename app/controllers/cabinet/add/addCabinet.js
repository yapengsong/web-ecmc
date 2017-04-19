/**
 * Created by cxy on 2016/4/1.
 */
angular.module('eayun.cabinet')
    .controller('CabinetAddCtrl', ['eayunModal','CabinetPhysicalService', function (eayunModal,CabinetPhysicalService,_model) {
        var vm = this;
        vm.model = angular.copy(_model,{});
        CabinetPhysicalService.getDataCenter().then(function (data) {
            vm.dcList=data;
        });
        /**改变数据中心下拉框*/
        vm.change= function (dcId) {
            CabinetPhysicalService.getDataCenterById(dcId).then(function (data) {
                vm.emptyCapa=data;
                if(!(vm.cabinetNum==null||vm.cabinetNum=='')){
                    vm.checkNum(vm.cabinetNum);
                }
                if(!(vm.model.cabinetName==null||vm.model.cabinetName==undefined)){
                    vm.checkName( vm.model.cabinetName);
                }

            });
            if(vm.model.name!=null){
                CabinetPhysicalService.validName(vm.model.name,null,dcId,vm.model.id).then(function (data) {
                    vm.validName=data;
                });
            }

        };
        /**校验*/
        vm.checkName= function (value) {


            vm.validName=true;
            var inputFormat=/^[\u4e00-\u9fa5a-zA-Z0-9]([\u4e00-\u9fa5_a-zA-Z0-9\s]{0,18}[\u4e00-\u9fa5a-zA-Z0-9]){0,1}$/;
            vm.nameFlag=CabinetPhysicalService.check(value,inputFormat);

            if(!vm.nameFlag){
                vm.model.cabinetNamelenth = 20;
                return vm.nameFlag;
            }
            if(vm.model.cabinetNum!=''&&vm.model.cabinetNum!=null&&typeof (vm.model.cabinetNum)!=undefined&&vm.model.cabinetNum!=1){
                vm.checkNum(vm.model.cabinetNum,value);
            }
            //if(vm.model.cabinetNum!=''&&vm.model.cabinetNum!=null&&typeof (vm.model.cabinetNum)!=undefined){
                CabinetPhysicalService.validName(value,vm.model.cabinetNum,vm.model.dcId,null).then(function (data) {

                    vm.validName=data;
                });

          //  }
            return vm.nameFlag;

        };

        vm.checkCapacity= function (value) {
            var inputFormat=/^([1-9]|[1-4]\d|50)$/;
            vm.capacityFlag=CabinetPhysicalService.check(value,inputFormat);
            if(value==''){
                 vm.capacityFlag=true;

                return vm.capacityFlag;
            }

            return vm.capacityFlag;
        };
        vm.checkNum= function (value,value1) {


                if (value == 1) {
                    vm.checkName(value1);
                }

                if (value > 1) {

                    if(value1!=null&&value1!=undefined){
                        if (value > 1) {
                                if (value1.length > 18) {
                                 vm.nameFlag = false;
                                  vm.model.cabinetNamelenth = 18;
                               }

                             }

                }
                }

            if (value >= 10) {
                if(value1!=null&&value1!=undefined){
                    if (value >= 10) {
                        if (value1.length > 17) {
                            vm.nameFlag = false;
                            vm.model.cabinetNamelenth = 17;
                        }

                    }

                }
            }



            vm.checkEmptyCapa=true;
            vm.numFlag=true;
            vm.validName=true;

            vm.model.cabinetNum=value;
            var inputFormat=/^[1-9][0-9]*$/;
            vm.numFlag=CabinetPhysicalService.check(value,inputFormat);
            if(vm.emptyCapa>=value&&vm.numFlag){
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