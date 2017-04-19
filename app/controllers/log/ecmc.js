/**
 * Created by ZHL on 2016/4/5.
 */
'use strict';

angular.module('eayun.log')
    .controller('LogEcmcCtrl', ['LogService','eayunModal',function (LogService,eayunModal) {
        var vm = this;
        vm.endTime = new Date();
        vm.beginTime = new Date(vm.endTime.getTime() - 7 * 24 * 3600 * 1000);
        vm.actItem = '';
        vm.resourceName = '';
        vm.ip = '';
        vm.table = {
            api: {},
            source: '/api/ecmc/system/log/getecmcloglistbymongon',
            getParams: function () {
                return{
                    begin : vm.beginTime.getTime(),
                    end : vm.endTime.getTime(),
                    status : vm.status,
                    actItem : vm.actItem,
                    resourceName : vm.resourceName,
                    ip : vm.ip
                }
            }
        };
        vm.detail = function (_ecmclog) {
            eayunModal.dialog({
                showBtn: false,
                title: '日志详情',
                width: '900px',
                templateUrl: 'controllers/log/ecmcdetail.html',
                controller: 'EcmcLogDetailCtrl',
                controllerAs: 'detail',
                resolve: {
                	ecmclog: function () {
                        return _ecmclog;
                    }
                }
            });
        };
        
        LogService.getAllProjectList().then(function (response) {
            vm.prjList = response;
        });
        vm.query = function(){
            if(vm.beginTime==null&&vm.endTime==null){
                eayunModal.error("请选择时间范围");
                return;
            }
            if(vm.beginTime==null){
                eayunModal.error("请选择开始时间");
                return;
            }
            if(vm.endTime==null){
                eayunModal.error("请选择截止时间");
                return;
            }
            vm.ms = vm.endTime.getTime()-vm.beginTime.getTime();
            vm.days = vm.ms/1000/60/60/24;
            if(vm.days > 30){
                eayunModal.error("时间范围不能大于30天");
                return;
            }else{
                vm.table.api.draw();
            }
        }
    }]);