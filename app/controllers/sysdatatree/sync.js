/**
 * Created by ZHL on 2016/4/5.
 */
'use strict';

angular.module('eayun.sysdatatree')
    .controller('SyncCtrl', ['syncService','eayunModal','SysCode','toast',function (syncService,eayunModal,SysCode,toast) {
            var vm = this;
            vm.syncTag = function(){
                    syncService.synTag().then(function (response) {
                        if(response.respCode == SysCode.success){
                            toast.success('标签缓存同步成功');
                        }else{
                            eayunModal.error('标签缓存同步失败');
                        }
                    });
            };
            vm.syncTree = function(){
                    syncService.syncDataTree().then(function (response) {
                        if(response.respCode == SysCode.success){
                            toast.success('数据字典同步成功');
                        }else if(response.respCode == SysCode.error){
                            eayunModal.error('数据字典同步失败');
                        }
                    });
            };
            vm.syncSms = function(){
                    syncService.syncSms().then(function (response) {
                        if(response.respCode == SysCode.success){
                            toast.success('项目短信配额同步成功');
                        }else if(response.respCode == SysCode.error){
                            eayunModal.error('项目短信配额同步失败');
                        }
                    });
            };
        vm.syncObs = function(){
            syncService.syncObs().then(function (response) {
                if(response.respCode == SysCode.success){
                    toast.success('obs同步成功');
                }else if(response.respCode == SysCode.error){
                    eayunModal.error('obs同步失败');
                }
            });
        };
        vm.syncLog = function(){
            syncService.syncLog().then(function (response) {
                if(response.code == SysCode.success){
                    toast.success('ecsc日志转移成功');
                }else if(response.code == SysCode.error){
                    eayunModal.error('ecsc日志转移失败');
                }
            });
        };
        vm.syncEcmcLog = function(){
            syncService.syncEcmcLog().then(function (response) {
                if(response.code == SysCode.success){
                    toast.success('ecmc日志转移成功');
                }else if(response.code == SysCode.error){
                    eayunModal.error('ecmc日志转移失败');
                }
            });
        };
        vm.syncPrice = function(){
            syncService.syncPrice().then(function (response) {
                if(response.respCode == SysCode.success){
                    toast.success('价格缓存同步成功');
                }else if(response.respCode == SysCode.error){
                    eayunModal.error('价格缓存同步失败');
                }
            });
        };

        vm.syncEcscMonitor = function () {
            syncService.syncEcscMonitor().then(function (response) {
                if(response.respCode == SysCode.success){
                    toast.success('ECSC监控报警缓存同步成功');
                }else if(response.respCode == SysCode.error){
                    eayunModal.error('ECSC监控报警缓存同步失败');
                }
            });
        };
        vm.syncEcmcMonitor = function () {
            syncService.syncEcmcMonitor().then(function (response) {
                if(response.respCode == SysCode.success){
                    toast.success('ECMC监控报警缓存同步成功');
                }else if(response.respCode == SysCode.error){
                    eayunModal.error('ECMC监控报警缓存同步失败');
                }
            });
        };
        vm.syncCusBlock = function(){
            syncService.syncCusBlock().then(function (response) {
                if(response.respCode == SysCode.success){
                    toast.success('客户状态缓存同步成功');
                }else if(response.respCode == SysCode.error){
                    eayunModal.error('客户状态缓存同步失败');
                }
            });
        };
        //同步黑名单
        vm.syncBlackList = function(){
            syncService.syncBlackList().then(function (response) {
                if(response.respCode == SysCode.success){
                    toast.success('黑名单缓存同步成功');
                }else if(response.respCode == SysCode.error){
                    eayunModal.error('黑名单缓存同步失败');
                }
            });
        };

        //Api访问限制同步
        vm.syncApiCount = function(){
            syncService.syncApiCount().then(function (response) {
                if(response.respCode == SysCode.success){
                    toast.success('Api访问限制同步成功');
                }else if(response.respCode == SysCode.error){
                    eayunModal.error('Api访问限制同步失败');
                }
            });
        };




    }]);