/**
 * Created by cxy on 2016/3/25.
 */
'use strict';

angular.module('eayun.firewall')
    .controller('FirewallPhysicalCtrl', ['FirewallPhysicalService','eayunModal','$stateParams','SysCode',function (FirewallPhysicalService,eayunModal,$stateParams,SysCode) {
        var physicalFirewall=this;
        var vm=this;
        physicalFirewall.model={};
        physicalFirewall.myTable={
            source: '/api/ecmc/physical/firewall/queryfirewall',
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
                    firewallName:physicalFirewall.firewallName
                };
            }
        };
        physicalFirewall.doSearch= function () {
            physicalFirewall.myTable.api.draw();
        };
        /**增加*/
        physicalFirewall.add= function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '添加防火墙',
                width: '600px',
                templateUrl: 'controllers/firewall/add/add.html',
                controller: 'FirewallAddCtrl',
                controllerAs:'model'

            });
            result.then(function (model) {
                FirewallPhysicalService.addFirewall(model).then(function () {
                        physicalFirewall.myTable.api.draw();
                });
            });
        };
        /**修改*/
        physicalFirewall.editFirewall= function (id) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '编辑防火墙',
                width: '600px',
                templateUrl: 'controllers/firewall/edit/edit.html',
                controller: 'FirewallEditCtrl',
                controllerAs:'model',
                resolve:{
                    model : function () {
                         return FirewallPhysicalService.getFirewall(id).then(function (data) {
                            return data;
                        });
                    }
                }

            });
            result.then(function (model) {
                FirewallPhysicalService.editFirewall(model).then(function () {
                    physicalFirewall.myTable.api.draw();
                });
            });
        };
        /**详情*/
        physicalFirewall.detail= function (id) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '防火墙详情',
                width: '1100px',
                templateUrl: 'controllers/firewall/detail/detail.html',
                controller: 'FirewallDetailCtrl',
                controllerAs:'detail',
                resolve: {
                    model : function () {
                        return FirewallPhysicalService.getFirewall(id).then(function (data) {
                            return data;
                        });
                    }
                }
            });
        };
        /**删除*/
        physicalFirewall.deleteFirewall= function (id) {
            eayunModal.confirm('确定删除防火墙吗？').then(
                function() {
                    FirewallPhysicalService.deleteFirewall(id).then(function (data) {
                        physicalFirewall.myTable.api.draw();
                    });
                });
        };

        FirewallPhysicalService.getDcList().then(function (data) {

            vm.dcList=data;
        });
    }]);