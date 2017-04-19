/**
 * Created by ZHL on 2016/3/25.
 */
'use strict';

angular.module('eayun.api')
    .service('ApiLimitService', ['$http', function ($http) {
        var ApiLimitService = this;

        //删除黑名单（客户、IP）
        ApiLimitService.deleteBlack = function(black){
            return $http.post('/api/ecmc/system/api/deleteBlack', {apiId:black.apiId}).then(function (response) {
                return response;
            });
        };
        //查询不在黑名单中的客户
        ApiLimitService.getCustExceptBlackCus = function(cusOrg){
            return $http.post('/api/ecmc/customer/getCustExceptBlackCus', {}).then(function (response) {
                return response;
            });
        };
        //添加黑名单（客户、IP）
        ApiLimitService.addBlack = function(model){
            var map ={};
            if(model.apiType == 'blackCus'){
                map ={
                    cusOrg : model.cusOrg ,
                    apiType : model.apiType
                };
                console.info("打印map为：");
                console.info(map);
            }else if(model.apiType == 'blackIp'){
                map ={
                    apiType : model.apiType,
                    ipPartOne : model.ipPartOne,
                    ipPartTwo : model.ipPartTwo,
                    ipPartThree : model.ipPartThree,
                    ipPartFour : model.ipPartFour
                };
            }
            return $http.post('/api/ecmc/system/api/addBlack', map).then(function (response) {
                return response.data;
            });
        };

        //校验输入ip是否重复
        ApiLimitService.checkBlackIpExist = function(model){
            var map ={};
            map ={
                ipPartOne : model.ipPartOne,
                ipPartTwo : model.ipPartTwo,
                ipPartThree : model.ipPartThree,
                ipPartFour : model.ipPartFour
            };
            return $http.post('/api/ecmc/system/api/checkBlackIpExist', map).then(function (response) {
                return response;
            });
        };

        ApiLimitService.getApiSwitch = function(_item){
            return $http.post('/api/ecmc/api/switch/getapiswitch', _item).then(function (response) {
                return response.data;
            });
        };
        ApiLimitService.getCodeForApiSwitch = function(_item){
            return $http.post('/api/ecmc/api/switch/getcodeforapiswitch', _item).then(function (response) {
                return response.data;
            });
        };
        ApiLimitService.operationApiSwitch = function(_item){
            return $http.post('/api/ecmc/api/switch/operationapiswitch', _item).then(function (response) {
                return response.data;
            });
        };
        ApiLimitService.getApiSwitchPhone = function(){
            return $http.post('/api/ecmc/api/switch/getapiswitchphone',{}).then(function (response) {
                return response.data;
            });
        };
        ApiLimitService.getApiType = function(){
            return $http.post('/api/ecmc/customer/getapitype',{}).then(function (response) {
                return response.data;
            });
        };
        //根据api类别获取相应的action
        ApiLimitService.getRestrictRequestCount=function(version,apiType){
            return $http.post('/api/ecmc/system/apicount/getdefaultapicountlist',{version:version,apiType:apiType}).then(function(response){
                return response.data;
            });
        }
        //修改默认请求次数限制
        ApiLimitService.updateApiRequestCount=function(actionsList,version,apiTypeName,apiType){
            return $http.post('/api/ecmc/system/apicount/updatedefaultapicount',{actionsList:actionsList,version:version,apiType:apiType,apiTypeName:apiTypeName}).then(function(response){
                return response.data;
            });
        }
    }]);