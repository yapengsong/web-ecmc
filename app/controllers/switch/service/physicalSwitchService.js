/**
 * Created by cxy on 2016/3/24.
 */
'use strict';

angular.module('eayun.switch')
    .service('SwitchPhysicalService', ['$http','SysCode','toast', function ($http,SysCode,toast) {
        var physicalSwitchService = {};

        physicalSwitchService.getSwitch=function(id){
            return $http.post('/api/ecmc/physical/switch/queryById',{switchId:id},{$showLoading :true}).then(function (response) {
                return response.data.data;
            });
        };

        physicalSwitchService.deleteSwitch=function(id){
            return $http.post('/api/ecmc/physical/switch/deleteswitch',{switchId:id},{$showLoading :true}).then(function (response) {
                if(response.data.respCode==SysCode.success){
                    toast.success('删除交换机成功!');
                }else{
                    toast.error('删除交换机失败!');
                }
            });
        };

        /******************************增加***************************************/
        /**获取数据中心列表*/
        physicalSwitchService.getDcList= function () {
            return $http.post('/api/ecmc/physical/datacenter/getlistdatacenter',{}).then(function (response) {
                return response.data.data;
            });
        };
        /**获取机柜列表*/
        physicalSwitchService.getCabinetList= function (id) {
            return $http.post('/api/ecmc/physical/cabinet/getcanUseCabinet',{dataCenterId:id}).then(function (response) {
                return response.data.data;
            });
        };
        physicalSwitchService.add= function (model) {
            return $http.post('/api/ecmc/physical/switch/addswitch',{switchmodel:model},{$showLoading :true}).then(function (response) {
                if(response.data.respCode==SysCode.success){
                    toast.success('添加交换机成功!');
                }else{
                    toast.error('添加交换机失败!');
                }
            });
        };
        /**************************编辑***************************/
        physicalSwitchService.edit= function (model) {
            return $http.post('/api/ecmc/physical/switch/updateswitch',{switchmodel:model},{$showLoading :true}).then(function (response) {
                if(response.data.respCode==SysCode.success){
                    toast.success('编辑交换机成功!');
                }else{
                    toast.error('编辑交换机失败!');
                }
            });
        };
        /**校验*/
        physicalSwitchService.check= function (value,inputFormat) {
            var flag=false;
            if(inputFormat.test(value)){
                flag=true;
            }else {
                flag=false;
            }
            return flag;
        };

        /**获取state*/
        physicalSwitchService.getState= function (dcId,cabinetId,spec,id) {
            return $http.post('/api/ecmc/physical/cabinet/getStateByCabinet',{dataCenterId:dcId,cabinetId:cabinetId,spec:spec,id:id}).then(function (response) {
                return response.data.data;
            });
        };
        /**校验state*/
        physicalSwitchService.checkState= function (data) {

            if(data!=null&&data.length>0){
                return true;
            }  else{
                return false;
            }
        };
        /**验证重名*/
        physicalSwitchService.validName= function (switchname,dataCenterId,id) {
            return $http.post('/api/ecmc/physical/switch/checkNameExist',{switchName:switchname,dataCenterId:dataCenterId,id:id}).then(function (response) {

                if(response.data.data){
                    return true;
                }else{
                    return false;
                }
            });
        };
        return physicalSwitchService;
    }])

