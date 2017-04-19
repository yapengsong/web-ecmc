/**
 * Created by cxy on 2016/3/24.
 */
'use strict';

angular.module('eayun.cabinet')

    .service('CabinetPhysicalService', ['$http','SysCode','toast', function ($http,SysCode,toast) {
        var physicalCabinetService = {};
        /**根据id获取Cabinet*/
        physicalCabinetService.getCabinetById = function(id){
            return $http.post('/api/ecmc/physical/cabinet/queryById',{cabinetId:id},{$showLoading :true}).then(function (response) {
                return response.data.data;
            });
        };
        /**删除*/
        physicalCabinetService.deleteCabinet=function(cabinetId,datecenterId){
            return $http.post('/api/ecmc/physical/cabinet/deletecabinet',{cabinetId:cabinetId,dataCenterId:datecenterId}).then(function (response) {
                //switch (response.data.code) {
                //    case SysCode.error:
                //        toast.error('删除机柜失败!');
                //        break;
                //    case  SysCode.success:
                //        toast.success('删除机柜成功!');
                //        break;
                //}
                return response.data;
            });
        }
/****************************添加**********************************/
        /**获取数据中心列表*/
        physicalCabinetService.getDataCenter= function () {
            return $http.post('/api/ecmc/physical/datacenter/getlistdatacenter', {})
                .then(function (response) {
                    return response.data.data;
                });
        };
        /**获取数据中心可用机柜空位*/
        physicalCabinetService.getDataCenterById= function (dcId,id) {
            return $http.post('/api/ecmc/physical/cabinet/checkDataCenter', {dataCenterId:dcId,cabinetId:id})
                .then(function (response) {
                    var emptyCapa=response.data.data;
                    return emptyCapa;
                });
        };
        /**名称验重*/
        physicalCabinetService.validName= function (cabinetName,num,dataCenterId,cabinetId) {
            return $http.post('/api/ecmc/physical/cabinet/checkNameExist', {cabinetName:cabinetName,dataCenterId:dataCenterId,num:num,cabinetId:cabinetId})
                .then(function (response) {

                    if(response.data.respCode==SysCode.success){
                        return true;
                    }else{
                        return false;
                    }
                });
        };
        /**校验*/
        physicalCabinetService.check= function (value,inputFormat) {
            var flag=false;
            if(inputFormat.test(value)){
                flag=true;
            }else {
                flag=false;
            }
            return flag;
        };
        /**添加*/
        physicalCabinetService.add= function (model) {
            return $http.post('/api/ecmc/physical/cabinet/addcabinet',{dataCenterId:model.dcId,cabinetName:model.cabinetName,totalCapacity:model.totalCapacity,cabinetNum:model.cabinetNum}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.error:
                        toast.error('添加机柜失败!');
                        break;
                    case  SysCode.success:
                        toast.success('添加机柜成功!');
                        break;
                }
            });
        };
        /*******************编辑*********************/
        /**编辑*/
        physicalCabinetService.edit= function (model) {
            return $http.post('/api/ecmc/physical/cabinet/updatecabinet',{cabinetId:model.id,dataCenterId:model.dataCenterId,cabinetName:model.name,totalCapacity:model.totalCapacity}).then(function (response) {
                if(response.data.respCode==SysCode.success){
                    toast.success('编辑机柜成功!');
                }else{

                    toast.error(response.data.data);
                }
            });
        };

        physicalCabinetService.nameCheck= function (value,num,dcId) {
            return $http.post('/api/ecmc/physical/cabinet/checkNameExist',{cabientName:value,num:num,dataCenterId:dcId}).then(function(response){
                if(response.data.respCode==SysCode.success){
                    return true;
                }else{
                    return false;
                }
            });
        };

        /**机柜规格验证*/
        physicalCabinetService.capacityCheck= function (cabinetId,capacity) {

            return $http.post('/api/ecmc/physical/cabinet/checkTotalCapacity',{cabinetId:cabinetId,totalCapacity:capacity}).then(function (response) {

                    return response;

            });
        };
        return physicalCabinetService;
    }])

