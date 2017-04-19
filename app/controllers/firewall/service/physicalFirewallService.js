/**
 * Created by cxy on 2016/3/25.
 */
'use strict';

angular.module('eayun.firewall')

    .service('FirewallPhysicalService', ['$http','SysCode','toast', function ($http,SysCode,toast) {
        var physicalFirewallService = {};


        physicalFirewallService.addFirewall= function (model) {
            return $http.post('/api/ecmc/physical/firewall/createfirewall',{firewallmodel:model},{$showLoading :true}).then(function (response) {
                if(response.data.respCode==SysCode.success){
                    toast.success('添加防火墙成功!');
                }else{
                    toast.error('添加防火墙失败!');
                }
            });
        };
        physicalFirewallService.getFirewall= function (id) {
            return $http.post('/api/ecmc/physical/firewall/queryById',{firewallId:id},{$showLoading :true}).then(function (response) {
                return response.data.data;
            });
        };
        physicalFirewallService.editFirewall=function(model){
            return $http.post('/api/ecmc/physical/firewall/updatefirewall',{firewallmodel:model},{$showLoading :true}).then(function (response) {
                if(response.data.respCode==SysCode.success){
                    toast.success('修改防火墙成功!');
                }else{
                    toast.error('修改防火墙失败!');
                }
            });
        }

        physicalFirewallService.deleteFirewall=function(id){
                return $http.post('/api/ecmc/physical/firewall/deletefirewall',{firewallId:id},{$showLoading :true}).then(function (response) {
                    if(response.data.respCode==SysCode.success){
                        toast.success('删除防火墙成功!');
                    }else{
                        toast.error('删除防火墙失败!');
                    }
                });
        };
    /*********************添加**************************/
        /**获取数据中心列表*/
        physicalFirewallService.getDcList= function () {
            return $http.post('/api/ecmc/physical/datacenter/getlistdatacenter',{}).then(function (response) {
                return response.data.data;
            });
        };
        /**获取机柜列表*/
        physicalFirewallService.getCabinetList= function (id) {
            return $http.post('/api/ecmc/physical/cabinet/getcanUseCabinet',{dataCenterId:id}).then(function (response) {
                return response.data.data;
            });
        };
        /**校验*/
        physicalFirewallService.check= function (value,inputFormat) {
            var flag=false;
            if(inputFormat.test(value)){
                flag=true;
            }else {
                flag=false;
            }
            return flag;
        };
        /**获取state*/
        physicalFirewallService.getState= function (dcId,cabinetId,spec,id) {
            return $http.post('/api/ecmc/physical/cabinet/getStateByCabinet',{dataCenterId:dcId,cabinetId:cabinetId,spec:spec,id:id}).then(function (response) {
                return response.data.data;
            });
        };
        /**校验state*/
        physicalFirewallService.checkState= function (data) {
            console.info(data!=null&&data.length>0);
            if(data!=null&&data.length>0){
                return true;
            }  else{
                return false;
            }
        };
        /**名称验重 添加*/
        physicalFirewallService.validName= function (name,dcId) {
            return $http.post('/api/ecmc/physical/firewall/checkNameExist',{firewallName:name,dataCenterId:dcId}).then(function (response) {
                return response.data.data;
                //if(response.data.respCode==SysCode.success){
                //    return true;
                //}else{
                //    return false;
                //}
            });
        };
        /**名称验重 编辑*/
        physicalFirewallService.validNameOfEdit= function (name,dcId,firewallId) {
            return $http.post('/api/ecmc/physical/firewall/checkNameExistOfEdit',{firewallName:name,dataCenterId:dcId,firewallId:firewallId}).then(function (response) {
                return response.data.data;
            });
        };
        return physicalFirewallService;
    }])

