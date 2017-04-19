/**
 * Created by eayun on 2016/4/1.
 */
'use strict'

angular.module('eayun.monitor')
    .service('MonitorService', ['$http', '$state', function ($http, $state) {
        var monitorService = {};

        monitorService.cloudHostDetail = function (_vmId) {
            $state.go('app.monitor.guide.detail', {vmId: _vmId});
        };

        monitorService.getDetailById = function (_vmId) {
            return $http.post('/api/ecmc/monitor/resource/getvmdetailbyid', {vmId: _vmId}).then(function (response) {
                return response.data;
            });
        };

        monitorService.getInterval = function () {
            return $http.post('/api/ecmc/monitor/resource/getinterval');
        };

        monitorService.getDcResourceList = function () {
            return $http.post('/api/ecmc/overview/getalldclist');
        };

        monitorService.getAllProjectList = function () {
            return $http.post('/api/ecmc/overview/getallprojectlist');
        };

        monitorService.getAllCustomerList = function () {
            return $http.post('/api/ecmc/overview/getallcustomerlist');
        };

        monitorService.getMonitorDataById = function (_data) {
            return $http.post('/api/ecmc/monitor/resource/getmonitordatabyid', _data).then(function (response) {
                return response.data;
            });
        };

        monitorService.getChartTimes = function () {
            return $http.post('/api/ecmc/monitor/resource/getcharttimes').then(function (response) {
                return response.data;
            });
        };

        monitorService.getChart = function (_name, _xDataList, _yDataList) {
            var data;
            data = {
                'xTime': _xDataList,
                'yData': _yDataList,
                'name': _name,
                'yDataMin': 2857.056,
                'yDataMax': 1231,
                'storageQuota': '55', //返回阈值设定的存储量的值
                'requestQuota': '55',//返回阈值设定的请求次数的值
                'loadFlowQuota': '55'//返回阈值设定的下载流量的值
            };
            return $.when(data);
        };

        monitorService.getDoubleChart = function (_nameFirst, _nameSecond, _xDataList, _yFirstDataList, _ySecondDataList) {
            var data;
            data = {
                'xTime': _xDataList,
                'yFirstData': _yFirstDataList,
                'ySecondData': _ySecondDataList,
                'nameFirst': _nameFirst,
                'nameSecond': _nameSecond,
                'yDataMin': 2857.056,
                'yDataMax': 1231,
                'storageQuota': '55', //返回阈值设定的存储量的值
                'requestQuota': '55',//返回阈值设定的请求次数的值
                'loadFlowQuota': '55'//返回阈值设定的下载流量的值
            };
            return $.when(data);
        };

        return {
            cloudHostDetail: monitorService.cloudHostDetail,
            getDetailById: monitorService.getDetailById,
            getInterval: monitorService.getInterval,
            getDcResourceList: monitorService.getDcResourceList,
            getAllProjectList: monitorService.getAllProjectList,
            getAllCustomerList: monitorService.getAllCustomerList,
            getMonitorDataById: monitorService.getMonitorDataById,
            getChartTimes: monitorService.getChartTimes,
            getChart: monitorService.getChart,
            getDoubleChart: monitorService.getDoubleChart
        };
    }]);