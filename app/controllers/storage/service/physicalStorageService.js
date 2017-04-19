/**
 * Created by cxy on 2016/3/25.
 */
'use strict';

angular.module('eayun.storage')
    .service('StoragePhysicalService', ['$http','toast','SysCode', function ($http,toast,SysCode) {
        var physicalStorageService = {};
        /******************************增加***************************************/
        /**获取数据中心列表*/
        physicalStorageService.getDcList= function () {
            return $http.post('/api/ecmc/physical/datacenter/getlistdatacenter',{}).then(function (response) {
                return response.data.data;
            });
        };
        /**获取机柜列表*/
        physicalStorageService.getCabinetList= function (id) {
            return $http.post('/api/ecmc/physical/cabinet/getcanUseCabinet',{dataCenterId:id}).then(function (response) {
                return response.data.data;
            });
        };
        /**添加*/
        physicalStorageService.add= function (model) {

            if(model.raidSupport==undefined ||model.raidSupport=='' ){
                model.raidSupport=0
            }
              return $http.post('/api/ecmc/physical/storage/queryDcStorageCreate',{storagemodel:model},{$showLoading :true}).then(function (response) {
                  if(response.data.respCode==SysCode.success){
                      toast.success('添加存储成功!');
                  }else{
                      toast.error('添加存储失败!');
                  }
              });
        };
        /**添加名称验重*/
        physicalStorageService.validAddName= function (storageName,datacenterId) {
            return $http.post('/api/ecmc/physical/storage/checkNameExist',{storageName:storageName,dataCenterId:datacenterId}).then(function (response) {
                return response.data.data;
            });
        };
        /**修改名称验重*/
        physicalStorageService.checkNameExistOfEdit= function (storageName,datacenterId,id) {
            return $http.post('/api/ecmc/physical/storage/checkNameExistOfEdit',{storageName:storageName,dataCenterId:datacenterId,storageId:id}).then(function (response) {
                return response.data.data;
            });
        };
        physicalStorageService.getStorage= function (id) {
            return $http.post('/api/ecmc/physical/storage/queryDcStorageById',{storageId:id},{$showLoading :true}).then(function (response) {
                return response.data.data;
            });
        };
        /**编辑*/
        physicalStorageService.editStorage=function(model){
            return $http.post('/api/ecmc/physical/storage/queryDcStorageUpdate',{storagemodel:model},{$showLoading :true}).then(function (response) {
                if(response.data.respCode==SysCode.success){
                    toast.success('修改存储成功!');
                }else{
                    toast.error('修改存储失败!');
                }

            });
        };
        /**删除**/
        physicalStorageService.deleteStorage=function(id){
            return $http.post('/api/ecmc/physical/storage/queryDcStorageDel',{storageId:id},{$showLoading :true}).then(function (response) {
                if(response.data.respCode==SysCode.success){
                    toast.success('删除存储成功!');
                }else{
                    toast.error('删除存储失败!');
                }
            });
        };
        /**校验*/
        physicalStorageService.check= function (value,inputFormat) {
            var flag=false;
            if(inputFormat.test(value)){
                flag=true;
            }else {
                flag=false;
            }
            return flag;
        };

        /**获取state*/
        physicalStorageService.getState= function (dcId,cabinetId,spec,id) {
            return $http.post('/api/ecmc/physical/cabinet/getStateByCabinet',{dataCenterId:dcId,cabinetId:cabinetId,spec:spec,id:id}).then(function (response) {
                return response.data.data;
            });
        };
        /**校验state*/
        physicalStorageService.checkState= function (data) {
            if(data!=null&&data.length>0){
                return true;
            }  else{
                return false;
            }
        };
        return physicalStorageService;
    }])

