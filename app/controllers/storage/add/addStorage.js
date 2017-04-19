/**
 * Created by Administrator on 2016/4/1.
 */
angular.module('eayun.storage')
    .controller('StorageAddCtrl', ['StoragePhysicalService','$scope', function (StoragePhysicalService,$scope) {
        var vm = this;
        vm.model={};
        vm.model.state='';
        vm.stateFlag=true;
        /**获取数据中心列表*/
        StoragePhysicalService.getDcList().then(function (data) {
            vm.dcList=data;
        });
        /**更改下拉框(数据中心)*/
        vm.changeDc= function (id,name) {
            vm.model.cabinetId='';
            vm.model.state='';
            vm.stateList='';
            vm.stateFlag=true;
            vm.stateflag=true;
            StoragePhysicalService.getCabinetList(id).then(function (data) {
                vm.cnList=data;

            });
            if(name!=null&&name!=undefined){
                vm.checkName(name);
            }

        };

        /**校验*/
        vm.checkSpec= function (value) {
            vm.model.state='';
            vm.stateFlag=true;
            vm.stateflag=false;
            vm.specFlagVal=true;
            var inputFormat=/^([1-9]|[1-4]\d|50)$/;
            vm.specFlag=StoragePhysicalService.check(value,inputFormat);
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
                StoragePhysicalService.getState(vm.model.dataCenterId, vm.model.cabinetId, value,null).then(function (data) {
                    vm.stateFlag = StoragePhysicalService.checkState(data);

                    vm.stateList = vm.stateFlag ? data : '';
                });
            }else{
                vm.stateFlag=true
            }
            return vm.specFlag;
        };
        /**更改机柜下拉框*/
        vm.changeCabinet= function () {
            vm.model.state='';
            vm.stateList='';
            vm.stateFlag=true;
            vm.stateflag=false;
            if(typeof(vm.model.spec)!='undefined'&&vm.model.spec!=null){
                StoragePhysicalService.getState(vm.model.dataCenterId,vm.model.cabinetId,vm.model.spec,null).then(function (data) {
                    vm.stateFlag = StoragePhysicalService.checkState(data);
                    vm.stateList = vm.stateFlag ? data : '';
                });
            }else{
                return ;
            }
        }
        vm.checkName= function (value) {
            vm.validName=true;
            var inputFormat=/^[\u4e00-\u9fa5a-zA-Z0-9]([\u4e00-\u9fa5_a-zA-Z0-9\s]{0,18}[\u4e00-\u9fa5a-zA-Z0-9]){0,1}$/;
            vm.nameFlag=StoragePhysicalService.check(value,inputFormat);
            if(!vm.nameFlag){
                return vm.nameFlag;
            }
            StoragePhysicalService.validAddName(value,vm.model.dataCenterId).then(function (data) {
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
        }
        //vm.checkMobile= function (value) {
        //    if(value==''||value==null){
        //        vm.pmFlag=true;
        //        return vm.pmFlag;
        //    }
        //    var inputFormat=/^1\d{10}$|^(0\d{2,3}-?|\(0\d{2,3}\))?[1-9]\d{4,7}(-\d{1,8})?$/;
        //    vm.pmFlag=StoragePhysicalService.check(value,inputFormat);
        //    return vm.pmFlag;
        //};
        vm.ok= function (model) {
            StoragePhysicalService.add(model).then(function () {
                $scope.ok();
            });
        }
    }]);