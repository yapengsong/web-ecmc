/**
 * Created by eayun on 2016/3/31.
 */
'use strict'

angular.module('eayun.workorder')
    .service('WorkorderService', ['$http', function ($http) {
        var workorderService = {};
        //查询所有有效客户
        workorderService.getAllCustomerList = function () {
            return $http.post('/api/ecmc/customer/getallcustomerorg').then(function (response) {
                return response.data;
            });
        };
        //根据客户ID获取客户信息
        workorderService.findUserByCusId = function (cusId) {
            return $http.post('/api/ecmc/customer/getuseraccountbycusid', {cusId: cusId}).then(function (response) {
                return response.data;
            });
        };
        workorderService.getDataTree=function(parentId){
            return $http.post('/api/ecmc/workorder/getdatatree', {parentId: parentId}).then(function (response) {
                return response.data;
            });
        };
        workorderService.getNoDoneFlaglist=function(){
            //查询工单未完成状态
            return $http.post('/api/ecmc/workorder/getnodoneflaglist').then(function (response) {
                return response.data;
            });
        };
        workorderService.getDoneFlagList=function(){
            //查询工单已完成状态
            return $http.post('/api/ecmc/workorder/getdoneflaglist').then(function (response) {
                return response.data;
            });
        };
        workorderService.getWorkFlagList=function(workFalg){
            return $http.post('/api/ecmc/workorder/getworkflaglistforordinary',{workFalg:workFalg}).then(function(response){
                return response.data;
            });
        }
        workorderService.getWorkHeadList=function(type,parId){
            return $http.post('/api/ecmc/workorder/getworkheadlist', {type: type,parentId:parId}).then(function (response) {
                return response.data;
            });
        }

        //根据工单ID获取工单详情
        workorderService.findWorkOrderByWorkId = function (workId_) {
            return $http.post('/api/ecmc/workorder/findworkbyworkid', {workId: workId_}).then(function (response) {
                return  response.data;
            });
        };

        //根据工单ID获取该工单回复信息
        workorderService.getWorkOpinionsByWorkId = function (workId_) {
            return $http.post('/api/ecmc/workorder/getworkopinionlist', {workId: workId_}).then(function (response) {
                return response.data;
            });
        };

        //回复工单
        workorderService.addWorkOpinion = function (workOpinion) {
            return $http.post('/api/ecmc/workorder/addecmcworkopinion', workOpinion).then(function (response) {
                return response.data;
            });
        };


        //添加工单
        workorderService.addWorkOrder = function (addModel) {
            return $http.post('/api/ecmc/workorder/addworkorder', addModel).then(function (response) {
                return response.data;
            });
        };

        //受理工单
        workorderService.acceptWorkOrder = function (workorder) {
            return $http.post('/api/ecmc/workorder/acceptancework', workorder).then(function (response) {
                return response.data;
            });
        };

        //编辑工单
        workorderService.editWorkOrder = function (workorder) {

            return $http.post('/api/ecmc/workorder/updateecmcworkorder', workorder).then(function (response) {
                return response.data;
            });
        };

        //根据用户Id查询用户信息
        workorderService.findApplyUserByCusId = function (cusId) {
            return $http.post('/api/ecmc/customer/getcustomerbyid', {cusId: cusId}).then(function (response) {
                return response.data;
            });
        };

        //审核通过
        workorderService.auditPassWork = function (workorder) {
            return $http.post('/api/ecmc/workorder/auditpasswork', workorder).then(function (response) {
                return response.data;
            });
        };

        //审核不通过
        workorderService.auditNotPassWork = function (workorder) {
            return $http.post('/api/ecmc/workorder/auditnotpasswork', workorder).then(function (response) {
                return response.data;
            });
        };

        //获取所有管理员和运维人员的已完成工单
        workorderService.countAllUserAcceptWorkOrder=function(operation){
            return $http.post('/api/ecmc/workorder/countalluseracceptworkorder', operation).then(function (response) {
                return response.data;
            });
        };

        //获取指定管理员和运维人员的已完成工单
        workorderService.countUserAcceptWorkOrder=function(personal){
            return $http.post('/api/ecmc/workorder/countuseracceptworkorder', personal).then(function (response) {
                return response.data;
            });
        };

        //更改工单级别
        workorderService.changeWorkLevel=function(workorder){
            return $http.post('/api/ecmc/workorder/updateecmcworkforworklevel', workorder).then(function (response) {
                return response.data;
            });
        };

        //获取求助人员
        workorderService.getEcmcAdminAndCpis=function(){
            return $http.post('/api/ecmc/workorder/gettruetoother').then(function (response) {
                return response.data;
            });
        };

        //求助其他工程师
        workorderService.truntootheruser=function(work){
            return $http.post('/api/ecmc/workorder/truntootheruser',work).then(function (response) {
                return response.data;
            });
        };

        //获取待处理工单的条数
        workorderService.getWorkOrderCount=function(parentId){
            return  $http.post('/api/ecmc/workorder/getWorkCountForFlag',{parentId:parentId}).then(function (response) {
               return response.data;
            });
        };
        //获取用户信息
        workorderService.findUserByUserId=function(userId){
            return  $http.post('/api/ecmc/workorder/finduserbyuserid',{userId:userId}).then(function (response) {
                return response.data;
            });
        }
        return {
            getAllCustomerList: workorderService.getAllCustomerList,
            findUserByCusId: workorderService.findUserByCusId,
            getWorkHeadList:workorderService.getWorkHeadList,
            getDoneFlagList:workorderService.getDoneFlagList,
            getNoDoneFlaglist:workorderService.getNoDoneFlaglist,
            getDataTree:workorderService.getDataTree,
            findWorkOrderByWorkId: workorderService.findWorkOrderByWorkId,
            getWorkOpinionsByWorkId: workorderService.getWorkOpinionsByWorkId,
            addWorkOrder: workorderService.addWorkOrder,
            addWorkOpinion: workorderService.addWorkOpinion,
            acceptWorkOrder: workorderService.acceptWorkOrder,
            editWorkOrder: workorderService.editWorkOrder,
            findApplyUserByCusId: workorderService.findApplyUserByCusId,
            auditPassWork: workorderService.auditPassWork,
            auditNotPassWork:workorderService.auditNotPassWork,
            getWorkFlagList:workorderService.getWorkFlagList,
            countAllUserAcceptWorkOrder:workorderService.countAllUserAcceptWorkOrder,
            countUserAcceptWorkOrder:workorderService.countUserAcceptWorkOrder,
            changeWorkLevel:workorderService.changeWorkLevel,
            getEcmcAdminAndCpis:workorderService.getEcmcAdminAndCpis,
            truntootheruser:workorderService.truntootheruser,
            getWorkOrderCount:workorderService.getWorkOrderCount,
            findUserByUserId:workorderService.findUserByUserId
    }
    }]);