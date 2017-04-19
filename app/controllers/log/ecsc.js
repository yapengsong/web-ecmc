/**
 * Created by ZHL on 2016/4/5.
 */
'use strict';

angular.module('eayun.log')
    .controller('LogEcscCtrl', ['eayunModal',function (eayunModal) {
        var vm = this;
        vm.endTime = new Date();
        vm.status;
        vm.actItem = '';
        vm.resourceName = '';
        vm.ip = '';
        vm.table = {
            api: {},
            source: '/api/ecmc/system/log/getecscloglistbymongon',
            getParams: function () {
                return{
                    begin : vm.beginTime.getTime(),
                    end : vm.endTime.getTime(),
                    status : vm.status,
                    actItem : vm.actItem,
                    resourceName : vm.resourceName,
                    ip : vm.ip,
                    operator : vm.operator
                }
            }
        };
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