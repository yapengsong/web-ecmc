/**
 * Created by chenglong on 2016/6/21 0021.
 */

angular.module('eayun.task')
    .controller('TaskAddCtrl', ['ServicetaskService', 'eayunModal', 'toast', function (ServicetaskService, eayunModal, _model, toast) {
        var vm = this;
        vm.model = {};
        vm.divlistvalue = [];
        vm.checkKeyFalg = false;
        vm.copy = function () {
            vm.divlistvalue.push({});
            vm.checkKeyFalg = true;
        };


        vm.checkBean = function (value) {
            vm.BeanVail = true;
            ServicetaskService.checkBeanVail(value).then(function (data) {
                vm.BeanVail = data;
            });
            return vm.BeanVail;
        };

        vm.checkdate = function (value) {
            vm.validdate = true;
            ServicetaskService.checkdate(value).then(function (data) {
                vm.validdate = data;
            });
            return vm.validdate;
        };

        vm.checkKey = function (value, index) {
            vm.checkKeyFalg = true;
            if ((vm.divlistvalue.length > 0 && value) || vm.divlistvalue.length == 0) {
                vm.checkKeyFalg = false;
            }
            vm.checkKeyExists(value, index);
        };

        vm.checkKeyNull = function () {
            vm.checkKeyFalg = false;
            if (vm.divlistvalue) {
                for(var i = 0; i < vm.divlistvalue.length; i++){
                    if(!vm.divlistvalue[i].key){
                        vm.checkKeyFalg = true;
                    }
                }
            }
        };

        vm.checkmethod = function (value, name) {
            vm.validmethod = true;
            ServicetaskService.checkmethod(value, name).then(function (data) {
                vm.validmethod = data;
            });
            return vm.validmethod;
        };

        vm.delete = function (index) {
            if (index == 0) {
                vm.divlistvalue.shift();
            } else if (index == vm.divlistvalue.length) {
                vm.divlistvalue.pop();
            } else {
                vm.divlistvalue.splice(index, 1);
            }
            vm.checkKeyExists(index);
            vm.checkKeyNull();
        };

        vm.checkKeyExists = function (key, index) {
            if(key && index){
                vm.divlistvalue[index].error = false;
                if (vm.divlistvalue.length > 1) {
                    for (var i = 0; i < vm.divlistvalue.length; i++) {
                        if (vm.divlistvalue[i].key == key && i != index) {
                            vm.divlistvalue[index].error = true;
                        }
                    }
                }
            }
            vm.isKeyExistsErr = false;
            for(var i = 0; i < vm.divlistvalue.length; i++){
                if(vm.divlistvalue[i].error){
                    vm.isKeyExistsErr = true;
                }
            }
        }

        vm.submit = function(){
            for(var i = 0; i < vm.divlistvalue.length; i++){
                delete vm.divlistvalue[i].error;
            }
            return vm.model;
        }

        vm.model.params = vm.divlistvalue;

    }]);