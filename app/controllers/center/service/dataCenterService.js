/**
 * Created by cxy on 2016/3/24.
 */
'use strict';

angular.module('eayun.center')
    .service('CenterDataService', ['$http','toast','SysCode','eayunModal','$q', function ($http,toast,SysCode,eayunModal,$q) {
        var dataCenterService = {};
        dataCenterService.getDCById = function(dcId){
            return $http.post('/api/ecmc/physical/datacenter/querybyid',{dataCenterId:dcId},{$showLoading :true}).then(function (response) {
                    return response.data.data;
            });
        };
        dataCenterService.flushDC=function(id){
            return $http.post('/api/ecmc/physical/datacenter/syndatacenter',{dataCenterId:id},{$showLoading :true}).then(function (response) {
                if(response.data.respCode==SysCode.success){
                    toast.success('数据同步成功!');
                }else{
                    toast.error('数据同步失败');
                }
            });
        };

        dataCenterService.edit=function(model){
            return $http.post('/api/ecmc/physical/datacenter/updatedatacenter', {datacentermodel:model},{$showLoading :true})
                .then(function (response) {
                    return response.data;
                });
        };
        dataCenterService.checkDelete= function (dcId) {
            return $http.post('/api/ecmc/physical/datacenter/checkcannotdelete',{dataCenterId:dcId},{$showLoading :true}).then(function (response) {
                //if(response.data.respCode==SysCode.success){
                //    return true;
                //}else{
                //    return false;
                //}
                return response.data;
            });
        };
        dataCenterService.deleteDC=function(dcId){
            return $http.post('/api/ecmc/physical/datacenter/deletedatacenter',{dataCenterId:dcId},{$showLoading :true}).then(function (response) {
                if(response.data.respCode==SysCode.success){
                    toast.success('删除数据中心成功!');
                }else{
                    toast.error('删除数据中心失败!');
                }
            });
        };
        /**详情*/
        dataCenterService.getDetail= function (dcId) {
            return $http.post('/api/ecmc/physical/datacenter/querybyid',{dataCenterId:dcId},{$showLoading :true}).then(function (response) {
                return response.data.data;
            });
        };

        /******************增加************************/
        /**上一页*/
        dataCenterService.goUp= function (pagenumber) {
            pagenumber--;
            if(pagenumber<1){
                pagenumber=1;
            }
            return pagenumber;
        };
        /**下一页*/
        dataCenterService.goDown= function (pagenumber) {
            pagenumber++;
            if(pagenumber>3){
                pagenumber=3;
            }
            return pagenumber;
        };
        /**添加数据中心*/
        dataCenterService.addCheck= function (model) {
            return $http.post('/api/ecmc/physical/datacenter/createdatacenter', {datacentermodel:model},{$showLoading :true})
                .then(function (response) {
                    return response.data;
                });
        };
        //dataCenterService.add= function (model) {
        //    return $http.post('/api/ecmc/physical/datacenter/createdatacenter', {datacentermodel:model})
        //        .then(function (response) {
        //            if(response.code.respCode==SysCode.success){
        //                toast.success('添加数据中心成功!');
        //            }else{
        //                toast.error('添加数据中心失败!');
        //            }
        //        });
        //};
        dataCenterService.nameCheck= function (value) {
            return $http.post('/api/ecmc/physical/datacenter/checkNameExist',{dcName:value}).then(function(response){
                if(true==response.data.data){
                    return  true;
                }else{
                    return false;
                }
            });
        };
        dataCenterService.apiDcCodeCheck= function (item) {
            return $http.post('/api/ecmc/physical/datacenter/checkapidccode',item).then(function(response){
                if(true==response.data.data){
                    return  true;
                }else{
                    return false;
                }
            });
        };
        dataCenterService.nameCheckOfEdit= function (model) {
            return $http.post('/api/ecmc/physical/datacenter/checkNameExistOfEdit',{dcName:model.name,dataCenterId:model.id}).then(function(response){
                if(true==response.data.data){
                    return  true;
                }else{
                    return false;
                }
            });
        };
        dataCenterService.IpCheck= function (value) {
            return $http.post('/api/ecmc/physical/datacenter/checkDcAddressExist',{ipAddress:value}).then(function(response){
                if(true==response.data.data){
                    return  true;
                }else{
                    return false;
                }
            });
        };



        dataCenterService.check= function (value,inputFormat) {
            var flag=false;
            if(inputFormat.test(value)){
                flag=true;
            }else {
                flag=false;
            }
            return flag;
        };
        return dataCenterService;
    }])

