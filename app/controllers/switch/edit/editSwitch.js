/**
 * Created by Administrator on 2016/4/1.
 */
angular.module('eayun.switch')
    .controller('SwitchEditCtrl', ['SwitchPhysicalService','model', function (SwitchPhysicalService,model) {
        var vm = this;
        vm.model=model;
        vm.stateFlag=true;
        /**获取数据中心列表*/
        SwitchPhysicalService.getDcList().then(function (data) {
            vm.dcList=data;
        });
        SwitchPhysicalService.getCabinetList(vm.model.dataCenterId).then(function (data) {
            vm.cnList=data;
        });
        /**更改下拉框(数据中心)*/
        vm.changeDc= function (id) {
            vm.model.cabinetId='';
            vm.model.state='';
            vm.stateList='';
            vm.stateflag=false;
            vm.stateFlag=true;

            vm.checkName(vm.model.name);


            SwitchPhysicalService.getCabinetList(id).then(function (data) {
                vm.cnList=data;
            });
        };
        /**更改下拉框(机柜列表)*/
        vm.changeCabinet= function () {
            vm.model.state='';
            vm.stateList='';
            vm.stateFlag=true;
            vm.stateflag=false;
            if(typeof(vm.model.spec)!='undefined'&&vm.model.spec!=''){
                SwitchPhysicalService.getState(vm.model.dataCenterId,vm.model.cabinetId,vm.model.spec,vm.model.id).then(function (data) {
                    vm.stateFlag = SwitchPhysicalService.checkState(data);
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
            vm.specFlag=SwitchPhysicalService.check(value,inputFormat);
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
                SwitchPhysicalService.getState(vm.model.dataCenterId, vm.model.cabinetId, value,vm.model.id).then(function (data) {
                    vm.stateFlag = SwitchPhysicalService.checkState(data);
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
            vm.nameFlag=SwitchPhysicalService.check(value,inputFormat);
            if(!vm.nameFlag){
                return vm.nameFlag;
            }
            SwitchPhysicalService.validName(value,vm.model.dataCenterId,vm.model.id).then(function (data) {
                vm.validName=data;
            });
            return vm.nameFlag;
        };
        vm.checkIp= function (value) {
            var inputFormat=/^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})){3}$/;
            vm.ipFlag=SwitchPhysicalService.check(value,inputFormat);
            return vm.ipFlag;
        };
        vm.checkPc= function (value) {
            var inputFormat=/^[1-9][0-9]*$/;
            vm.pcFlag=SwitchPhysicalService.check(value,inputFormat);
            return vm.pcFlag;
        };

        //vm.checkMobile= function (value) {
        //    if(value==''||value==null){
        //        vm.pmFlag=true;
        //        return vm.pmFlag;
        //    }
        //    var inputFormat=/^1\d{10}$|^(0\d{2,3}-?|\(0\d{2,3}\))?[1-9]\d{4,7}(-\d{1,8})?$/;
        //    vm.pmFlag=SwitchPhysicalService.check(value,inputFormat);
        //    return vm.pmFlag;
        //};
    }]);