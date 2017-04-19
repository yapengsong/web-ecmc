/**
 * Created by Administrator on 2016/4/1.
 */
angular.module('eayun.server')
    .controller('ServerAddCtrl', ['eayunModal','ServerPhysicalService', function (eayunModal,ServerPhysicalService) {
        var vm = this;
        vm.model={};
        vm.stateFlag=true;
        /**获取数据中心列表*/
        ServerPhysicalService.getDcList().then(function (data) {
            vm.dcList=data;
        });
        /**获取型号列表*/
        ServerPhysicalService.getModelList().then(function (data) {
            vm.modelList=data;
        });
        /**更改下拉框(数据中心)*/
        vm.changeDc= function (id) {
            vm.model.cabinetId='';
            vm.model.state='';
            vm.stateflag=true;
            ServerPhysicalService.getCabinetList(id).then(function (data) {
                vm.cnList=data;
            });
            if(vm.model.name!=null){
                ServerPhysicalService.validName(vm.model.name,vm.model.datacenterId,vm.model.id).then(function (data) {

                    vm.validName=data;
                });
            }

        };
        /**获取服务器型号列表*/
            ServerPhysicalService.getModelList().then(function (data) {
                vm.modelList=data
            });
        /**改变服务器型号列表*/
        vm.changeModel= function (id) {
            ServerPhysicalService.getModel(id).then(function (data) {
                vm.md=data;
                vm.model.spec=data.spec;
                vm.model.cpu=data.cpu;
                vm.model.memory=data.memory;
                vm.model.disk=data.disk;
                ServerPhysicalService.getState(vm.model.datacenterId,vm.model.cabinetId,vm.model.spec,null).then(function (data) {
                    vm.stateFlag = ServerPhysicalService.checkState(data);
                    vm.stateList = vm.stateFlag ? data : '';
                });
            });

        };
        /**改变机柜列表*/
        vm.changeCabinet= function () {
            vm.model.state='';
            vm.stateList='';
            vm.stateFlag=true;
            vm.stateflag=false;
            console.info(typeof(vm.model.spec)!='undefined'&&vm.model.spec!=null);
            if(typeof(vm.model.spec)!='undefined'&&vm.model.spec!=null){
                ServerPhysicalService.getState(vm.model.datacenterId,vm.model.cabinetId,vm.model.spec,null).then(function (data) {
                    vm.stateFlag = ServerPhysicalService.checkState(data);
                    vm.stateList = vm.stateFlag ? data : '';
                });
            }else{
                return ;
            }
        };
        /**校验*/
        vm.checkName= function (value) {
            vm.validName=true;
            ServerPhysicalService.validName(value,vm.model.datacenterId,null).then(function (data) {

                vm.validName=data;
            });
            return vm.validName;
        };
        vm.checkIP= function (value) {
            if(value==''||value==null){
                vm.ipFlag=true;
                return vm.ipFlag;
            }
            var inputFormat=/^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/;
            vm.ipFlag=ServerPhysicalService.check(value,inputFormat);
            return vm.ipFlag;
        };
        //vm.checkMobile= function (value) {
        //    if(value==''||value==null){
        //        vm.pmFlag=true;
        //        return vm.pmFlag;
        //    }
        //    var inputFormat=/^1[3|5|8|7][0-9]\d{8}$/;
        //    vm.pmFlag=ServerPhysicalService.check(value,inputFormat);
        //    return vm.pmFlag;
        //};


    }]);