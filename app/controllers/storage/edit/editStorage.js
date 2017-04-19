/**
 * Created by Administrator on 2016/4/1.
 */
angular.module('eayun.storage')
    .controller('StorageEditCtrl', ['StoragePhysicalService','model', function (StoragePhysicalService,model) {
        var vm = this;
        vm.model=model;
        vm.stateFlag=true;
        /**获取数据中心列表*/
        StoragePhysicalService.getDcList().then(function (data) {
            vm.dcList=data;
        });
        /**获取机柜列表*/
        StoragePhysicalService.getCabinetList(vm.model.dataCenterId).then(function (data) {
            vm.cnList=data;
        });
        /**获取机柜可用位置列表*/
        StoragePhysicalService.getState(vm.model.dataCenterId,vm.model.cabinetId,vm.model.spec,vm.model.id).then(function (data) {
            vm.stateList=data;
        });
        /**更改下拉框(数据中心)*/
        vm.changeDc= function (id) {
            vm.model.cabinetId='';
            vm.model.state='';
            vm.stateList='';
            vm.stateflag=false;
            vm.stateFlag=true;
            StoragePhysicalService.getCabinetList(id).then(function (data) {
                vm.cnList=data;
            });
            if(vm.model.name!=undefined){
                vm.checkName(vm.model.name);
            }
        };
        /**更改下拉框(机柜列表)*/
        vm.changeCabinet= function () {
            vm.model.state='';
            vm.stateList='';
            vm.stateFlag=true;
            vm.stateflag=false;


            if(typeof(vm.model.spec)!='undefined'&&vm.model.spec!=''){
                StoragePhysicalService.getState(vm.model.dataCenterId,vm.model.cabinetId,vm.model.spec,vm.model.id).then(function (data) {
                    vm.stateFlag = StoragePhysicalService.checkState(data);
                    vm.stateflag=true;
                    vm.stateList = vm.stateFlag ? data : '';
                });
            }else{
                return ;
            }
        };
        /**校验*/
        vm.checkSpec= function (value,stateCount) {

            if(stateCount){
                vm.model.state='';
            }
            vm.stateFlag=true;
            vm.stateflag=false;
            vm.specFlagVal=true;
            var inputFormat=/^([1-9]|[1-4]\d|50)$/;
            vm.specFlag=StoragePhysicalService.check(value,inputFormat);
            if(!vm.specFlag){
                vm.model.state='';
                vm.stateList='';
                return vm.specFlag;
            }
            if(value==''){
                vm.model.state='';
                vm.stateList='';
                return !vm.specFlagVal;
            }
            if(typeof(vm.model.dataCenterId)!='undefined'&&typeof(vm.model.cabinetId)!='undefined') {
                StoragePhysicalService.getState(vm.model.dataCenterId, vm.model.cabinetId, value,vm.model.id).then(function (data) {
                    vm.stateFlag = StoragePhysicalService.checkState(data);
                    vm.stateflag=true;
                    vm.stateList = vm.stateFlag ? data : '';
                });
            }else{
                vm.stateFlag=true;
            }
            return vm.specFlag;
        };
        vm.checkName= function (value) {
            vm.validName=true;
            var inputFormat=/^[\u4e00-\u9fa5a-zA-Z0-9]([\u4e00-\u9fa5_a-zA-Z0-9\s]{0,18}[\u4e00-\u9fa5a-zA-Z0-9]){0,1}$/;
            vm.nameFlag=StoragePhysicalService.check(value,inputFormat);
            if(!vm.nameFlag){
                return vm.nameFlag;
            }
            StoragePhysicalService.checkNameExistOfEdit(value,vm.model.dataCenterId,vm.model.id).then(function (data) {
                vm.validName=data;

            });
            return vm.nameFlag;
        };
        vm.checkModel= function (value) {
            var inputFormat=/^[\u4e00-\u9fa5a-zA-Z0-9]([\u4e00-\u9fa5_a-zA-Z0-9\s]{0,18}[\u4e00-\u9fa5a-zA-Z0-9]){0,1}$/;
            vm.modelFlag=StoragePhysicalService.check(value,inputFormat);
            return vm.modelFlag;
        };
        vm.checkValue= function (value) {
            var inputFormat=/^([1-9]\d{0,8}|9)?$/;
            vm.valueFlag=StoragePhysicalService.check(value,inputFormat);
            return vm.valueFlag;
        };
        vm.checkRate= function (value) {
            var inputFormat=/^([1-9]\d{0,8}|9)?$/;
            vm.rateFlag=StoragePhysicalService.check(value,inputFormat);
            return vm.rateFlag;
        };
        vm.checkCache= function (value) {
            if(value==''||value==null){
                vm.cacheFlag=true;
                return vm.cacheFlag;
            }
            var inputFormat=/^([1-9]\d{0,8}|9)?$/;
            vm.cacheFlag=StoragePhysicalService.check(value,inputFormat);
            return vm.cacheFlag;
        };

      
    }]);