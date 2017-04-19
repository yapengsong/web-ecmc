/**
 * Created by Administrator on 2016/4/1.
 */
angular.module('eayun.firewall')
    .controller('FirewallEditCtrl', ['FirewallPhysicalService','model', function (FirewallPhysicalService,model) {
        var vm = this;
        vm.model=model;
        vm.stateFlag=true;
        /**获取数据中心列表*/
        FirewallPhysicalService.getDcList().then(function (data) {
            vm.dcList=data;
        });
        /**更改下拉框(数据中心)*/
        vm.changeDc= function (id) {
            vm.model.cabinetId='';
            vm.model.state='';
            vm.stateList='';
            vm.stateflag=false;
            vm.stateFlag=true;
            FirewallPhysicalService.getCabinetList(id).then(function (data) {
                vm.cnList=data;
            });
            vm.checkName(vm.model.name);
        };
        FirewallPhysicalService.getCabinetList(vm.model.dataCenterId).then(function (data) {
            vm.cnList=data;
        });
        FirewallPhysicalService.getState(vm.model.dataCenterId, vm.model.cabinetId, vm.model.spec,vm.model.id).then(function (data) {
            vm.stateFlag = FirewallPhysicalService.checkState(data);
            vm.stateList = vm.stateFlag ? data : '';
        });
        /**更改下拉框(机柜列表)*/
        vm.changeCabinet= function () {
            vm.model.state='';
            vm.stateList='';
            vm.stateFlag=true;
            vm.stateflag=false;
            if(typeof(vm.model.spec)!='undefined'&&vm.model.spec!=''){
                FirewallPhysicalService.getState(vm.model.dataCenterId,vm.model.cabinetId,vm.model.spec,vm.model.id).then(function (data) {
                    vm.stateFlag = FirewallPhysicalService.checkState(data);
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
            vm.specFlag=FirewallPhysicalService.check(value,inputFormat);
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
                FirewallPhysicalService.getState(vm.model.dataCenterId, vm.model.cabinetId, value,vm.model.id).then(function (data) {
                    vm.stateFlag = FirewallPhysicalService.checkState(data);
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
            vm.nameFlag=FirewallPhysicalService.check(value,inputFormat);
            if(!vm.nameFlag){
                return vm.nameFlag;
            }
            FirewallPhysicalService.validNameOfEdit(value,vm.model.dataCenterId,vm.model.id).then(function (data) {
                vm.validName=data;
            });
            return vm.nameFlag;
        };
        vm.checkIp= function (value) {
            var inputFormat=/^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})){3}$/;
            vm.ipFlag=FirewallPhysicalService.check(value,inputFormat);

            return vm.ipFlag;
        };
        vm.checkConn= function (value) {
            var inputFormat=/^[1-9][0-9]{0,19}$/;
            vm.connFlag=FirewallPhysicalService.check(value,inputFormat);
            return vm.connFlag;
        };
        vm.checkNet= function (value) {
            var inputFormat=/^[1-9]{1}[0-9]{0,19}$/;
            vm.netFlag=FirewallPhysicalService.check(value,inputFormat);
            return vm.netFlag;
        };
        //vm.checkMobile= function (value) {
        //    if(value==''||value==null){
        //        vm.pmFlag=true;
        //        return vm.pmFlag;
        //    }
        //    var inputFormat=/^1\d{10}$|^(0\d{2,3}-?|\(0\d{2,3}\))?[1-9]\d{4,7}(-\d{1,8})?$/;
        //    vm.pmFlag=FirewallPhysicalService.check(value,inputFormat);
        //    return vm.pmFlag;
        //};
        vm.checkMobile= function (value) {
            vm.pmFlag=true;

            if(value.length>50) {
                vm.pmFlag = false;

            }
            return vm.pmFlag;
        };

    }]);