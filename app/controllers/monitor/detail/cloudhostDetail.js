/**
 * Created by eayun on 2016/4/1.
 */
'use strict'

angular.module('eayun.monitor')
    .controller('MonitorCloudHostDetailCtrl', ['$stateParams', '$timeout', 'MonitorService', 'SysCode', function ($stateParams, $timeout, MonitorService, SysCode) {
        var vm = this;

        vm.changeType = function (str) {
            vm.type = str;
            vm.refreshCharts(vm.type);
        };

        vm.type = 'monitorCPU';
        vm.interval = '3';

        var vmId = $stateParams.vmId;

        MonitorService.getDetailById(vmId).then(function (response) {
            vm.monitorModel = response.data;
            var data = {};
            data.endTime = new Date().getTime();
            data.vmId = vm.monitorModel.vmId;
            data.count = '3';
            data.type = 'monitorCPU';
            montageChartsData(data);
        });

        MonitorService.getChartTimes().then(function (response) {
            if (response.respCode == SysCode.success) {
                vm.queryInterval = response.data;
            }
        });

        vm.refreshCharts = function (_type) {
            if(vm.endDate.getTime()>new Date().getTime()){
                vm.endDate=new Date();
            }
            var _data = {};
            _data.vmId = vmId;
            _data.endTime = vm.endDate.getTime();
            _data.count = vm.interval;
            _data.type = vm.type;
            if (_type == 'monitorCPU' || _type == 'monitorRam') {
                montageChartsData(_data);
            } else {
                montageDoubleChartsData(_data);
            }
        };
        var montageChartsData = function (_data) {
            var xDataList = [];
            var yDataList = [];
            var atr = '';
            switch(_data.type){
                case 'monitorCPU':
                    atr = 'cpu';
                    _data.name = 'CPU利用率(%)';
                    break;
                case 'monitorRam':
                    atr = 'ram';
                    _data.name = '内存占用率(%)';
                    break;
            }
            MonitorService.getMonitorDataById(_data).then(function (response) {
                var list = response.data;
                angular.forEach(list, function (value) {
                    yDataList.push(value[atr].toFixed(1));
                    if(vm.interval >= 1440){
                        xDataList.push(new Date(value.timestamp).Format("MM-dd"));
                    }else{
                        xDataList.push(new Date(value.timestamp).Format("MM-dd hh:mm"));
                    }
                });
                vm.getChart(_data.name, xDataList, yDataList);
            });
        };

        var montageDoubleChartsData = function (_data) {
            var xDataList = [];
            var yFirstDataList = [];
            var ySecondDataList = [];
            var atrFirst = '';
            var atrSecond = '';
            if (_data.type == 'monitorNet') {
                atrFirst = 'netOut';
                atrSecond = 'netIn';
                _data.nameFirst = '网卡下行速率';
                _data.nameSecond = '网卡上行速率';
                _data.nameTitle = '网卡流速(Mb/s)';
            } else {
                atrFirst = 'diskRead';
                atrSecond = 'diskWrite';
                _data.nameFirst = '磁盘读吞吐';
                _data.nameSecond = '磁盘写吞吐';
                _data.nameTitle = '磁盘吞吐量(MB/s)';
            }
            MonitorService.getMonitorDataById(_data).then(function (response) {
                var doubleList = response.data;
                angular.forEach(doubleList, function (value) {
                    yFirstDataList.push(value[atrFirst].toFixed(4));
                    ySecondDataList.push(value[atrSecond].toFixed(4));
                    if(vm.interval >= 1440){
                        xDataList.push(new Date(value.timestamp).Format("MM-dd"));
                    }else{
                        xDataList.push(new Date(value.timestamp).Format("MM-dd hh:mm"));
                    }
                });
                vm.getDoubleLineChart(_data.nameFirst, _data.nameSecond,_data.nameTitle, xDataList, yFirstDataList, ySecondDataList);
            });
        };

        Date.prototype.Format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1,                  //月份
                "d+": this.getDate(),                       //日
                "h+": this.getHours(),                      //小时
                "m+": this.getMinutes(),                    //分
                "s+": this.getSeconds(),                    //秒
                "q+": Math.floor((this.getMonth() + 3) / 3),//季度
                "S": this.getMilliseconds()                 //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        };
        /*CPU、内存*/
        vm.getChart = function (_name, _xDataList, _yDataList) {
            vm.myChart.clear();
            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: [
                    {
                        data: _xDataList,
                        boundaryGap : false,//类目起始和结束两端空白策略，见下图，默认为true留空，false则顶头
                        name:'日期',
                        axisLabel: {
                            show: true,
                            interval: 0,
                            rotate: vm.interval >= 1440?0:-30
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: _name,
                        boundaryGap:['0%', '1%']
                    }
                ],
                series: [
                    {
                        type: 'line',
                        data: _yDataList,
                        name: _name,
                        smooth: true
                    }
                ],
                grid: {
                    x:60,
                    y:30
                }
            };
            if(_xDataList.length>15){
                option.xAxis[0].axisLabel.interval=1;
            }
            vm.myChart.setOption(option);
            window.onresize = vm.myChart.resize;
        };
        /*磁盘、网络*/
        vm.getDoubleLineChart = function (_nameFirst, _nameSecond, nameTitle,_xDataList, _yFirstDataList, _ySecondDataList) {
            vm.myChart.clear();
            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: [_nameFirst, _nameSecond]
                },
                xAxis: [
                    {
                        data: _xDataList,
                        boundaryGap : false,//类目起始和结束两端空白策略，见下图，默认为true留空，false则顶头
                        name:'日期',
                        axisLabel: {
                            show: true,
                            interval: 0,
                            rotate: vm.interval >= 1440?0:-30
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: nameTitle,
                        boundaryGap:['0%', '1%']
                    }
                ],
                series: [
                    {
                        type: 'line',
                        data: _yFirstDataList,
                        name: _nameFirst,
                        smooth: true
                    },
                    {
                        type: 'line',
                        data: _ySecondDataList,
                        name: _nameSecond,
                        smooth: true
                    }
                ],
                grid: {
                    x: 60,
                    y:30
                }
            };
            if(_xDataList.length>15){
                option.xAxis[0].axisLabel.interval=1;
            }
            vm.myChart.setOption(option);
            window.onresize = vm.myChart.resize;
        };
    }]);