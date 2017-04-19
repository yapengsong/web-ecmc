/**
 * Created by cxy on 2016/3/25.
 */
'use strict';

angular.module('eayun.model')
    .service('ModelPhysicalService', ['$http','SysCode','toast', function ($http,SysCode,toast) {
        var physicalModelService = {};

        physicalModelService.addModel =function(model){
            return $http.post('/api/ecmc/physical/servermodel/createModel',{name: model.name, memory: model.memory, cpu: model.cpu, disk: model.disk, spec: model.spec, processor: model.processor},{$showLoading :true}).then(function (response) {
                if(response.data.respCode==SysCode.success){
                    toast.success('添加型号成功!');
                }else{
                    toast.error('添加型号失败!');
                }
            });
        };
        physicalModelService.getModel= function (id) {
            return $http.post('/api/ecmc/physical/servermodel/getDcServerOne',{id:id},{$showLoading :true}).then(function (response) {
                return response.data;
            });
        };
        physicalModelService.editModel =function(model){
            return $http.post('/api/ecmc/physical/servermodel/updateModel',{id:model.id,name: model.name, memory: model.memory, cpu: model.cpu, disk: model.disk, spec: model.spec, processor: model.processor,creUser:model.creUser,creDate:model.creDate},{$showLoading :true}).then(function (response) {
                if(response.data.respCode==SysCode.success){
                    toast.success('修改服务器型号成功!');
                }else{
                    toast.error('修改服务器型号失败!');
                }
            });
        }
        physicalModelService.checkDelete =function(id){
            return $http.post('/api/ecmc/physical/servermodel/checkUseOrNo',{DcServerModelID:id},{$showLoading :true}).then(function (response) {
                if(response.data.respCode==SysCode.success){
                    return true;
                }else{
                    return false;
                }
            });
        }
        physicalModelService.deleteModel =function(id){
            return $http.post('/api/ecmc/physical/servermodel/deleteModel',{ids:id},{$showLoading :true}).then(function (response) {
                if(response.data.respCode==SysCode.success){
                    toast.success('删除服务器型号成功!');
                }else{
                    toast.error('删除服务器型号失败!');
                }
            });
        }
        /**校验*/
        physicalModelService.check= function (value,inputFormat) {
            var flag=false;
            if(inputFormat.test(value)){
                flag=true;
            }else {
                flag=false;
            }
            return flag;
        };

        physicalModelService.validAddName= function (name) {
            return $http.post('/api/ecmc/physical/servermodel/checkNameExist',{name:name}).then(function (response) {
                return !response.data.data;
            });
        };
        physicalModelService.validAddNameOfEdit= function (name,id) {
            return $http.post('/api/ecmc/physical/servermodel/checkNameExistOfEdit',{name:name,id:id}).then(function (response) {
                return !response.data.data;
            });
        };
        return physicalModelService;
    }])

