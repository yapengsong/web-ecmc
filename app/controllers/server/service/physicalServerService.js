/**
 * Created by cxy on 2016/3/24.
 */
'use strict';

angular.module('eayun.server')
    .service('ServerPhysicalService', ['$http','SysCode','toast', function ($http,SysCode,toast) {
        var physicalServerService = {};

        physicalServerService.getServer = function(id){
            return $http.post('/api/ecmc/physical/server/getByDcServerId',{serverId:id},{$showLoading :true}).then(function (response) {
                return response.data.data;
            });
        };

        physicalServerService.add = function(model){
            return $http.post('/api/ecmc/physical/server/saveserver',{servermodel:model},{$showLoading :true}).then(function (response) {
                if(response.data.respCode==SysCode.success){
                    toast.success('添加服务器成功!');
                }else{
                    toast.error('添加服务器失败!');
                }

            });
        };
        physicalServerService.edit = function(model){
            return $http.post('/api/ecmc/physical/server/updateserver',{servermodel:model},{$showLoading :true}).then(function (response) {
                if(response.data.respCode==SysCode.success){
                    toast.success('修改服务器成功!');
                }else{
                    toast.error('修改服务器失败!');
                }

            });
        };

        physicalServerService.deleteServer=function(idstr){

            return $http.post('/api/ecmc/physical/server/deleteserver',{idstr:idstr},{$showLoading :true}).then(function (response) {
                if(response.data.respCode==SysCode.success){
                    toast.success('删除服务器成功!');
                }else{
                    toast.error('删除服务器失败!');
                }
            });
        }
/************************添加******************************/
        /**获取数据中心列表*/
        physicalServerService.getDcList= function () {
            return $http.post('/api/ecmc/physical/datacenter/getlistdatacenter',{}).then(function (response) {
                return response.data.data;
            });
        };
        /**获取机柜列表*/
        physicalServerService.getCabinetList= function (id) {
            return $http.post('/api/ecmc/physical/cabinet/getcanUseCabinet',{dataCenterId:id}).then(function (response) {
                return response.data.data;
            });
        };
        /**获取服务器型号列表*/
        physicalServerService.getModelList= function () {
            return $http.post('/api/ecmc/physical/server/queryByServerModel',{}).then(function (response) {
                return response.data.data;
            });
        };
        /**获取服务器信息*/
        physicalServerService.getModel= function (id) {
            return $http.post('/api/ecmc/physical/server/getByServerModelId',{serverModelId:id}).then(function (response) {
                return response.data.data;
            });
        }
        /**校验*/
        physicalServerService.check= function (value,inputFormat) {
            var flag=false;
            if(inputFormat.test(value)){
                flag=true;
            }else {
                flag=false;
            }
            return flag;
        };
        /**获取机柜下的位置*/
        physicalServerService.getState= function (datacenterId,cabinetId,spec,modelId) {

            return $http.post('/api/ecmc/physical/cabinet/getStateByCabinet',{dataCenterId:datacenterId,cabinetId:cabinetId,id:modelId,spec:spec}).then(function (response) {
                return response.data.data;
            });

        };
        /**校验state*/
        physicalServerService.checkState= function (data) {
            if(data!=null&&data.length>0){
                return true;
            }  else{
                return false;
            }
        };
        physicalServerService.validName= function (serverName,datacenterId,serverId) {
            return $http.post('/api/ecmc/physical/server/checkNameExist',{serverName:serverName,dataCenterId:datacenterId,serverId:serverId}).then(function (response) {
                return response.data.data;
            });
        };
        return physicalServerService;
    }])

