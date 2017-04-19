/**
 * Created by Administrator on 2016/4/1.
 */
angular.module('eayun.server')
    .controller('ServerEditCtrl', ['eayunModal','ServerPhysicalService','model', function (eayunModal,ServerPhysicalService,model) {
        var vm = this;
        vm.model=model;
        vm.stateFlag=true;
        vm.checkModelFal=true;
        vm.checkModela=true;
        vm.model.isMonitor=vm.model.isMonitor=='1'?true:false;
        /**获取数据中心列表*/
        ServerPhysicalService.getDcList().then(function (data) {
            vm.dcList=data;
        });
        ServerPhysicalService.getCabinetList(vm.model.datacenterId).then(function (data) {
            vm.cnList=data;
        });
        ServerPhysicalService.getState(vm.model.datacenterId,vm.model.cabinetId,vm.model.spec,vm.model.id).then(function (data) {
            vm.stateList=data;
        });


        if( vm.model.cabinetId==undefined){

            vm.checkModelFal=false;
        }
        /**更改下拉框(数据中心)*/
        vm.changeDc= function (id) {
            vm.model.cabinetId='';
            vm.model.state='';
            vm.stateList='';
            vm.stateflag=false;
            vm.stateFlag=true;
            vm.checkModela=true;
            vm.checkModelFal=false;
            ServerPhysicalService.getCabinetList(id).then(function (data) {
                vm.cnList=data;


            });
            ServerPhysicalService.validName(vm.model.name,vm.model.datacenterId,vm.model.id).then(function (data) {

                vm.validName=data;
            });
        };
        /**获取服务器型号列表*/

            ServerPhysicalService.getModelList().then(function (data) {
                vm.modelList=data;
                ServerPhysicalService.getModel(vm.model.serverModelId).then(function(data){
                    vm.model.spec='';
                   if(data){
                       vm.md=data;
                       vm.model.spec=data.spec;
                       vm.model.cpu=data.cpu;
                       vm.model.memory=data.memory;
                       console.info(data.disk);
                       vm.model.disk=data.disk;
                   }
                });
            });

        /**改变服务器型号列表*/
        vm.changeModel= function (id) {
            ServerPhysicalService.getModel(id).then(function (data) {
                vm.model.spec='';
                if(data){
                    vm.md=data;
                    vm.model.spec=data.spec;
                    vm.model.cpu=data.cpu;
                    vm.stateflag=true;
                    vm.model.memory=data.memory;
                    vm.model.disk=data.disk;
                    vm.changeCabinet();
                }
            });
        };
        /**改变机柜列表*/
        vm.changeCabinet= function () {
            vm.model.state='';
            vm.stateList='';
            vm.stateFlag=true;
            vm.stateflag=true;
            vm.checkModelFal=true;
            if(typeof(vm.model.spec)!='undefined'&&vm.model.spec!=''){
                ServerPhysicalService.getState(vm.model.datacenterId,vm.model.cabinetId,vm.model.spec,vm.model.id).then(function (data) {
                    vm.stateFlag = ServerPhysicalService.checkState(data);
                    vm.stateflag=true;
                    vm.stateList = vm.stateFlag ? data : '';
                });
            }else{
                return;
            }
        };
        /**校验*/
        vm.checkName= function (value) {
            vm.validName=true;
            ServerPhysicalService.validName(value,vm.model.datacenterId,vm.model.id).then(function (data) {

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
        //
        //    var inputFormat=/^1\d{10}$|^(0\d{2,3}-?|\(0\d{2,3}\))?[1-9]\d{4,7}(-\d{1,8})?$/;
        //    vm.pmFlag=ServerPhysicalService.check(value,inputFormat);
        //  //console.info( vm.pmFlag+"111");
        //   // vm.pmFlag=true;
        //   // console.info( vm.pmFlag+"222");
        //    return vm.pmFlag;
        //};


    }]);