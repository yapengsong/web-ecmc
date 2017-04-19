/**
 * Created by eayun on 2016/3/28.
 */
'use strict'

angular.module('eayun.monitor')
    .controller('MonitorCloudHostCtrl', ['MonitorService', 'SysCode','$timeout','$scope', function (MonitorService, SysCode,$timeout,$scope) {
        var vm = this;
        vm.maxDate=new Date();
        vm.dataType = '';
        vm.resourceType = '';
        vm.sort = '';

        vm.query = {
            dcName: ''
        };
        vm.search = '';
        vm.options = {
            searchFn: function () {
                vm.initialize();
                vm.cloudHostTable.api.draw();
            },
            select: [{obj: '名称'}, {pro: '项目'}, {cus: '客户'}],
            series: {
                cus: {
                    multi: true,
                    data: function () {
                        return MonitorService.getAllCustomerList().then(function (response) {
                            var array = [];
                            angular.forEach(response.data, function (value) {
                                array.push(value.cusOrg);
                            });
                            return array;
                        });
                    }
                },
                pro: {
                    multi: true,
                    data: function () {
                        return MonitorService.getAllProjectList().then(function (response) {
                            var array = [];
                            angular.forEach(response.data, function (value) {
                                array.push(value.prjName);
                            });
                            return array;
                        });
                    }
                }
            },
            checkbox: true
        };

        vm.queryInterval = {};

        MonitorService.getInterval().then(function (response) {
            if (response.data.respCode == SysCode.success) {
                vm.queryInterval = response.data.data;
            }
        });
        /*初始化没有排序*/
        vm.initialize  = function () {
            vm.resourceType = '';
            vm.sort='';
            vm.sortClass = 'glyphicon glyphicon-sort';
            vm.sortCpuClass = 'glyphicon glyphicon-sort';
            vm.sortRamClass = 'glyphicon glyphicon-sort';
            vm.sortOutClass = 'glyphicon glyphicon-sort';
            vm.sortInClass = 'glyphicon glyphicon-sort';
            vm.sortReadClass = 'glyphicon glyphicon-sort';
            vm.sortWriteClass = 'glyphicon glyphicon-sort';
        };
        vm.initialize();
        vm.changeResSort = function (_resourceType) {
            if(vm.resourceType!=_resourceType){
                vm.initialize();
            }
            vm.resourceType = _resourceType;
            switch (vm.sort) {
                case ''     :
                    vm.sort = 'DESC';
                    vm.sortClass = 'glyphicon glyphicon-arrow-down';
                    break;
                case 'DESC' :
                    vm.sort = 'ASC';
                    vm.sortClass = 'glyphicon glyphicon-arrow-up';
                    break;
                case 'ASC'  :
                    vm.sort = 'DESC';
                    vm.sortClass = 'glyphicon glyphicon-arrow-down';
                    break;
            };
            switch (_resourceType) {
                case 'cpu'     :
                    vm.sortCpuClass = vm.sortClass;
                    break;
                case 'ram' :
                    vm.sortRamClass = vm.sortClass;
                    break;
                case 'outgoing'  :
                    vm.sortOutClass = vm.sortClass;
                    break;
                case 'incomming'     :
                    vm.sortInClass = vm.sortClass;
                    break;
                case 'write' :
                    vm.sortWriteClass = vm.sortClass;
                    break;
                case 'read'  :
                    vm.sortReadClass = vm.sortClass;
                    break;
            };
            vm.cloudHostTable.api.draw();
        };

        vm.cloudHostTable = {
            source: '/api/ecmc/monitor/resource/getvmlistforecmclive',
            api: {},
            getParams: function () {
                if (vm.dataType == 'real-time') {
                    return {
                        dcName: vm.query.dcName,
                        queryType: vm.search.key ? vm.search.key : '',
                        queryName: vm.search.value ? vm.search.value : '',
                        orderBy:vm.resourceType?vm.resourceType:'',
                        sort: vm.sort?vm.sort:''
                    };
                } else {
                    return {
                        dcName: vm.query.dcName,
                        queryType: vm.search.key ? vm.search.key : '',
                        queryName: vm.search.value ? vm.search.value : '',
                        endDate: vm.endDate != ''&&vm.endDate!=null ? vm.endDate.getTime() : new Date().getTime(),
                        interval: vm.dataType,
                        orderBy: vm.resourceType,
                        sort: vm.sort?vm.sort:''
                    };
                }
            }
        };
        vm.timeRange = 'real-time';
        vm.noData = false;
        /*选择时间范围*/
        vm.queryTable = function () {
            if (vm.dataType == 'real-time') {
                vm.cloudHostTable.source = '/api/ecmc/monitor/resource/getvmlistforecmclive';
                vm.timeRange = 'real-time';
            } else {
                if(null==vm.endDate || vm.timeRange === 'real-time'){
                    vm.endDate = new Date();
                }
                if(vm.dataType <= 1440){
                    vm.today = new Date();
                    if(vm.endDate){
                        if((vm.today.getTime()+vm.dataType*60000)<vm.endDate.getTime()){
                            vm.noData = true;
                            return;
                        }
                    }
                }
                vm.noData = false;
                //由时分秒转年月日，或由实时转年月日
                if(vm.dataType > 1440 && (vm.timeRange === 'real-time' || vm.timeRange <= 1440)){
                    vm.endDate.setHours(0);
                    vm.endDate.setMinutes(0);
                    vm.endDate.setSeconds(0);
                }else if(vm.dataType <= 1440 && (vm.timeRange === 'real-time' || vm.timeRange > 1440)){
                    //由年月日转时分秒,或由实时转时分秒
                    vm.endDate = new Date();
                }

                vm.cloudHostTable.source = '/api/ecmc/monitor/resource/getvmlistforecmclast';
                vm.initialize();
                vm.timeRange = vm.dataType;
            }
            vm.cloudHostTable.api.setSource(vm.cloudHostTable.source);
            vm.cloudHostTable.api.draw();
        };
        /*选择日期*/
        vm.queryTableFromDate = function (isDay) {
            if('no' === isDay){
                vm.today = new Date();
                if(vm.endDate){
                    if((vm.today.getTime()+vm.dataType*60000)<vm.endDate.getTime()){
                        vm.noData = true;
                        return;
                    }
                }
            }
            vm.noData = false;
            if(null == vm.endDate){
                vm.endDate = new Date();
                if('yes' === isDay){
                    vm.endDate.setHours(0);
                    vm.endDate.setMinutes(0);
                    vm.endDate.setSeconds(0);
                }
            }
            vm.initialize();
            vm.cloudHostTable.source = '/api/ecmc/monitor/resource/getvmlistforecmclast';
            vm.cloudHostTable.api.setSource(vm.cloudHostTable.source);
            vm.cloudHostTable.api.draw();
        };
        vm.dcResourceList = {};

        MonitorService.getDcResourceList().then(function (response) {
            vm.dcResourceList = response.data;
        });

        vm.detail = function (vmId) {
            MonitorService.cloudHostDetail(vmId);
        };
        var timer;
        vm.flush= function () {
            timer=$timeout(function(){
                if(vm.dataType=='real-time'){
                    vm.cloudHostTable.api.refresh();
                }
            },20000);
            timer.then(function () {
                vm.flush();
            });
        };
        vm.flush();
        $scope.$on('$destroy', function () {
            $timeout.cancel(timer);
        });
    }]);