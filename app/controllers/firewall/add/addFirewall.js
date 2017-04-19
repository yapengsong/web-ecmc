/**
 * Created by Administrator on 2016/4/1.
 */
angular.module('eayun.firewall')
    .controller('FirewallAddCtrl', ['FirewallPhysicalService', function (FirewallPhysicalService) {
        var vm = this;
        vm.model={};
        vm.model.state='';
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
            vm.stateFlag=true;
            vm.stateflag=true;
            if(vm.model.name!=null){
                vm.checkName(vm.model.name);
            }

            FirewallPhysicalService.getCabinetList(id).then(function (data) {
                vm.cnList=data;
            });

        };
        /**更改机柜下拉框*/
        vm.changeCabinet= function () {
            vm.model.state='';
            vm.stateList='';
            vm.stateFlag=true;
            vm.stateflag=false;
            if(typeof(vm.model.spec)!='undefined'&&vm.model.spec!=null){
                FirewallPhysicalService.getState(vm.model.dataCenterId,vm.model.cabinetId,vm.model.spec,null).then(function (data) {
                    vm.stateFlag = FirewallPhysicalService.checkState(data);
                    vm.stateList = vm.stateFlag ? data : '';
                });
            }else{
                return ;
            }
        };
        /**校验*/
        vm.checkSpec= function (value) {
            vm.model.state='';
            vm.stateFlag=true;
           // vm.stateflag=false;
            vm.specFlagVal=true;
            var inputFormat=/^([1-9]|[1-4]\d|50)$/;
            vm.specFlag=FirewallPhysicalService.check(value,inputFormat);


            if(value==''){

                vm.model.state='';
                vm.stateList='';
                vm.flag=true;
                vm.specFlag=true;
                return vm.specFlag;
            }
            if(!vm.specFlag){
                vm.model.state='';
                vm.stateList='';
                return vm.specFlag;
            }

            if(typeof(vm.model.dataCenterId)!='undefined'&&vm.model.cabinetId!='') {
                FirewallPhysicalService.getState(vm.model.dataCenterId, vm.model.cabinetId, value,null).then(function (data) {
                    vm.stateFlag = FirewallPhysicalService.checkState(data);

                    vm.stateList = vm.stateFlag ? data : '';
                });
            }
            //else{
            //    vm.stateFlag=true
            //}
            return vm.specFlag;
        };
        vm.checkName= function (value) {
            vm.validName=true;
            var inputFormat=/^[\u4e00-\u9fa5a-zA-Z0-9]([\u4e00-\u9fa5_a-zA-Z0-9\s]{0,18}[\u4e00-\u9fa5a-zA-Z0-9]){0,1}$/;
            vm.nameFlag=FirewallPhysicalService.check(value,inputFormat);
            if(!vm.nameFlag){
                return vm.nameFlag;
            }
            FirewallPhysicalService.validName(value,vm.model.dataCenterId).then(function (data) {
                vm.validName=data;
            });
            return vm.nameFlag;
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
        vm.checkMobile= function (value) {
            vm.pmFlag=true;

           if(value.length>50) {
               vm.pmFlag = false;

           }
            return vm.pmFlag;
        };
        vm.checkIp= function (value) {
            var inputFormat=/^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})){3}$/;
            vm.ipFlag=FirewallPhysicalService.check(value,inputFormat);
         
            return vm.ipFlag;
        };



    }]);