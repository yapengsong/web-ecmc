/**
 * Created by ZHL on 2016/4/6.
 */
'use strict';

angular.module('eayun.net')
    .service('floatService', ['$http', function ($http) {
        var floatService = this;
        floatService.getAllDcList = function () {
            return $http.post('/api/ecmc/overview/getalldclist').then(function (response) {
                return response.data;
            });
        };
        floatService.getAllProjectList = function () {
            return $http.post('/api/ecmc/overview/getallprojectlist');
        };
        floatService.getAllCustomerList = function () {
            return $http.post('/api/ecmc/overview/getallcustomerlist');
        };
        floatService.allocateIptonum = function (_item) {
            return $http.post('/api/ecmc/virtual/floatip/allocateIptonum',_item || {}).then(function (response) {
                return response.data;
            });
        };
        floatService.checkIpNum = function (prjId,inputnum) {
            return $http.post('/api/ecmc/virtual/floatip/checkeIpNow',{'prjId':prjId,'ipnum':inputnum}).then(function (response) {
                return response.data;
            });
        };
        floatService.checkPrjIpNum = function (prjId) {
            return $http.post('/api/ecmc/virtual/floatip/remainnum',{'prjId':prjId}).then(function (response) {
                return response.data;
            });
        };
        floatService.bind = function (_item) {
            return $http.post('/api/ecmc/virtual/floatip/binDingVm',_item || {}).then(function (response) {
                return response.data;
            });
        };
        floatService.getNetList = function (prjId) {
            return $http.post('/api/ecmc/virtual/network/getnetworklistbyprjid', {prjId:prjId}).then(function (response) {
                return response.data;
            });
        };
        floatService.getSubList = function (netId) {
            return $http.post('/api/ecmc/virtual/subnetwork/getsubnetlistbynetid',{'netId':netId}).then(function (response) {
                return response.data;
            });
        };
        floatService.getVMListByPrj = function (subnetworkId) {
            return $http.post('/api/ecmc/virtual/floatip/getVmBySubNetWork',{'subnetworkId':subnetworkId}).then(function (response) {
                return response.data;
            });
        };
        floatService.getLBListByPrj = function (subnetworkId) {
            return $http.post('/api/ecmc/virtual/loadbalance/pool/getnotbindfloatippools',{'subnetId':subnetworkId}).then(function (response) {
                return response.data;
            });
        };
        floatService.unBind = function (_item) {
            return $http.post('/api/ecmc/virtual/floatip/unBinDingVm',_item || {}).then(function (response) {
                return response.data;
            });
        };
        floatService.release = function (dcId,prjId,floId,resourceId,floIp) {
            return $http.post('/api/ecmc/virtual/floatip/deallocateFloatIp',{'datacenterId':dcId,'projectId':prjId,'id':floId,'resourceId':resourceId,'floIp':floIp}).then(function (response) {
                return response.data;
            });
        };
        floatService.checkFloWebSite = function (_item) {
            return $http.post('/api/ecmc/virtual/floatip/checkflowebsite',_item || {}).then(function (response) {
                return response.data;
            });
        };
        return floatService;
    }]);