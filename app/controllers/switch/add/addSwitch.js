/**
 * Created by cxy on 2016/4/1.
 */
angular.module('eayun.switch')
    .controller('SwitchAddCtrl', ['eayunModal','SwitchPhysicalService','$scope', function (eayunModal,SwitchPhysicalService,$scope) {
        var vm = this;
        vm.model={};
        vm.model.state='';
        vm.stateFlag=true;
        /**获取数据中心列表*/
        SwitchPhysicalService.getDcList().then(function (data) {
            vm.dcList=data;
        });
        /**更改下拉框(数据中心)*/
        vm.changeDc= function (id) {
            vm.model.cabinetId='';
            vm.model.state='';
            vm.stateList='';
            vm.stateFlag=true;
            vm.stateflag=true;
          SwitchPhysicalService.getCabinetList(id).then(function (data) {
              vm.cnList=data;
          });
            if(vm.model.name!=undefined){
                vm.checkName(vm.model.name);
            }

        };
        /**更改机柜下拉框*/
        vm.changeCabinet= function () {
            vm.model.state='';
            vm.stateList='';
            vm.stateFlag=true;
            vm.stateflag=false;


            if(typeof(vm.model.spec)!='undefined'&&vm.model.spec!=null){
                SwitchPhysicalService.getState(vm.model.dataCenterId,vm.model.cabinetId,vm.model.spec,null).then(function (data) {
                    vm.stateFlag = SwitchPhysicalService.checkState(data);
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
            vm.stateflag=false;
            vm.specFlagVal=true;
            var inputFormat=/^([1-9]|[1-4]\d|50)$/;
            vm.specFlag=SwitchPhysicalService.check(value,inputFormat);
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
                SwitchPhysicalService.getState(vm.model.dataCenterId, vm.model.cabinetId, value,null).then(function (data) {
                    vm.stateFlag = SwitchPhysicalService.checkState(data);

                    vm.stateList = vm.stateFlag ? data : '';
                });
            }else{
                vm.stateFlag=true
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
            SwitchPhysicalService.validName(value,vm.model.dataCenterId,null).then(function (data) {
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
        vm.ok= function (model) {
            SwitchPhysicalService.add(model).then(function () {
                $scope.ok();
            });
        }
    }]);