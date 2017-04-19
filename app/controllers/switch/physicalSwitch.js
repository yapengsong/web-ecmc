/**
/**
 * Created by cxy on 2016/3/24.
 */
'use strict';

angular.module('eayun.switch')
    .controller('SwitchPhysicalCtrl', ['SwitchPhysicalService','eayunModal','$stateParams',function (SwitchPhysicalService,eayunModal,$stateParams) {
        var physicalSwitch=this;
        var vm=this;
        /**表格*/
        physicalSwitch.myTable={
            source: '/api/ecmc/physical/switch/queryswitch',
            api: {},
            getParams: function () {
                if(vm.dcId){
                    $stateParams.dcId=vm.dcId;
                }
                if(vm.dcId==''){

                    $stateParams.dcId=vm.dcId;
                }
                return {
                    dataCenterId : $stateParams.dcId,
                    switchName:physicalSwitch.switchName
                };
            }
        };
        /**查询*/
        physicalSwitch.doSearch= function () {
              physicalSwitch.myTable.api.draw();
        };
        /**添加交换机*/
        physicalSwitch.add= function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '添加交换机',
                width: '600px',
                templateUrl: 'controllers/switch/add/add.html',
                controller: 'SwitchAddCtrl',
                controllerAs:'model'

            });
            result.then(function () {
                physicalSwitch.myTable.api.draw();
            });
        };
        /**编辑交换机*/
        physicalSwitch.editSwitch= function (id) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '编辑交换机',
                width: '600px',
                templateUrl: 'controllers/switch/edit/edit.html',
                controller: 'SwitchEditCtrl',
                controllerAs:'model',
                resolve: {
                    model : function () {
                        return SwitchPhysicalService.getSwitch(id).then(function (data) {
                            return data;
                        });
                    }
                }

            });
            result.then(function (model) {
                SwitchPhysicalService.edit(model).then(function () {
                    physicalSwitch.myTable.api.draw();
                });
            });
        };
        /**详情*/
        physicalSwitch.detail= function (id) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '交换机详情',
                width: '1100px',
                templateUrl: 'controllers/switch/detail/detail.html',
                controller: 'SwitchDetailCtrl',
                controllerAs:'detail',
                resolve: {
                    model : function () {
                        return SwitchPhysicalService.getSwitch(id).then(function (data) {
                            return data;
                        });
                    }
                }
            });
        };

        /**删除*/
        physicalSwitch.deleteSwitch= function (id) {
            eayunModal.confirm('确定删除交换机？').then(
                function() {
                    SwitchPhysicalService.deleteSwitch(id).then(function () {
                        physicalSwitch.myTable.api.draw();
                    });
                });
        };

        SwitchPhysicalService.getDcList().then(function (data) {

            vm.dcList=data;
        });
    }]);