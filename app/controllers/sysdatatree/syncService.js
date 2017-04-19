/**
 * Created by ZHL on 2016/4/6.
 */
'use strict';

angular.module('eayun.sysdatatree')
    .service('syncService', ['$http', function ($http) {
        var syncService = this;
        syncService.syncDataTree = function () {
            return $http.post('/api/ecmc/system/enum/syncdatatree',{},{$showLoading : true}).then(function (response) {
                return response.data;
            });
        };
        syncService.synTag = function () {
            return $http.post('/api/ecmc/virtual/tag/syncRedisWithDB',{},{$showLoading : true}).then(function (response) {
                return response.data;
            });
        };
        syncService.syncSms = function () {
            return $http.post('/api/ecmc/monitor/alarm/resyncsmsquotacache',{},{$showLoading : true}).then(function (response) {
                return response.data;
            });
        };
        syncService.syncObs = function () {
            return $http.post('/api/ecmc/obs/obsview/syncobsuser',{},{$showLoading : true}).then(function (response) {
                return response.data;
            });
        };
        syncService.syncLog = function () {
            return $http.post('/api/ecmc/system/log/syncLog',{},{$showLoading : true}).then(function (response) {
                return response.data;
            });
        };
        syncService.syncEcmcLog = function () {
            return $http.post('/api/ecmc/system/log/syncEcmcLog',{},{$showLoading : true}).then(function (response) {
                return response.data;
            });
        };
        syncService.syncPrice = function () {
            return $http.post('/api/billing/factor/syncfactorprice',{},{$showLoading : true}).then(function (response) {
                return response.data;
            });
        };

        syncService.syncEcscMonitor = function () {
            return $http.post('/api/monitor/alarm/syncEcscMonitor',{},{$showLoading : true}).then(function (response){
                return response.data;
            });
        };
        syncService.syncEcmcMonitor = function () {
            return $http.post('/api/ecmc/monitor/alarm/syncEcmcMonitor',{},{$showLoading : true}).then(function (response){
                return response.data;
            });
        };
        syncService.syncCusBlock = function () {
            return $http.post('/api/ecmc/customer/synccustomer',{},{$showLoading : true}).then(function (response) {
                return response.data;
            });
        };

        //同步黑名单
        syncService.syncBlackList = function () {
            return $http.post('/api/ecmc/system/api/synchronizeBlack',{},{$showLoading : true}).then(function (response) {
                return response.data;
            });
        };
        //Api访问限制同步
        syncService.syncApiCount = function () {
            return $http.post('/api/ecmc/system/apicount/syncapicount',{},{$showLoading : true}).then(function (response) {
                return response.data;
            });
        };

    }]);