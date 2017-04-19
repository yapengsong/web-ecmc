'use strict'
angular.module('eayun.api')
    .controller('ApiOverviewCtrl', ['$scope','$state','apioverviewService','SysCode','toast', function ($scope,$state,apioverviewService,SysCode,toast) {
        var vm=this;
        vm.cusId = '';
        vm.cusList = [];
        vm.now=new Date();
        vm.endTime=vm.now;
        vm.startTime=new Date(vm.endTime.getTime()-6 * 24 * 3600 * 1000);
        apioverviewService.getCusListByOrg({}).then(function (data) {
            if(data.respCode == SysCode.success){
                vm.cusList=data.data;
                vm.cusId = vm.cusList[0].cusId;
                vm.getDetails();
            }
        });
        vm.changeCusId = function(){
            vm.getDetails();
            vm.apiDetailsTable.api.draw();
        };
        vm.isShow = false;
        vm.changeTime = function(days){
            if(Number(days) > 0){
                vm.isShow = false;
                vm.endTime=vm.now;
                vm.startTime=new Date(vm.endTime.getTime()-(Number(days)-1) * 24 * 3600 * 1000);
            }else if(Number(days) == 0){
                vm.isShow = true;
                vm.endTime=vm.now;
                vm.startTime=new Date(vm.endTime.getTime()-6 * 24 * 3600 * 1000);
            }
            if(null==vm.startTime){
                toast.error('开始时间不能为空！');
                vm.startTime=vm.lastStart;
                return false;
            }
            if(null==vm.endTime){
                toast.error('结束时间不能为空！');
                vm.endTime=vm.lastEnd;
                return false;
            }
            vm.interval = (vm.endTime.getTime()-vm.endTime.getMilliseconds())-(vm.startTime.getTime()-vm.startTime.getMilliseconds());
            if(vm.interval > (29*24*3600*1000)){
                toast.error('时间范围不得大于30天！');
                vm.startTime=vm.lastStart;
                vm.endTime=vm.lastEnd;
                return false;
            }
            vm.getDetails();
            vm.apiDetailsTable.api.draw();
        };
        vm.interval = (vm.endTime.getTime()-vm.endTime.getMilliseconds())-(vm.startTime.getTime()-vm.startTime.getMilliseconds());
        vm.apiDetailsTable={
            source: '/api/ecmc/api/overview/getapidetailspage',
            api: {},
            getParams: function () {
                return {
                    cusId : vm.cusId,
                    startDate : vm.startTime.getTime(),
                    endDate : vm.endTime.getTime()
                };
            },
            result: []
        };
        vm.getDetails = function(){
            vm.lastStart=vm.startTime;
            vm.lastEnd=vm.endTime;
            vm.queryParams = {
                cusId : vm.cusId,
                startDate :vm.startTime.getTime(),
                endDate : vm.endTime.getTime()
            };
            var dateList = [];
            var totalList = [];
            var sucList = [];
            var failList = [];
            apioverviewService.getApiOverviewDetails(vm.queryParams).then(function (response) {
                var apiList = response.data;
                angular.forEach(apiList, function (value) {
                    totalList.push(value.totalCount);
                    sucList.push(value.successCount);
                    failList.push(value.failCount);
                    if(vm.interval > (4*24*3600*1000)){
                        dateList.push(new Date(value.timestamp).Format("MM-dd"));
                    }else{
                        dateList.push(new Date(value.timestamp).Format("MM-dd hh:mm"));
                    }
                });
                var max = apiList[0].maxCount;
                var min = apiList[0].minCount;
                max = (Number(max)*1.2).toFixed(0);
                min = (Number(min)*0.8).toFixed(0);
                vm.getLineChart(dateList,totalList,sucList,failList,max,min);
            });
        };
        vm.getLineChart = function (_xDateList, _yTotalList, _ySucList, _yFailList,max,min) {
            vm.myChart.clear();
            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['请求次数', '成功次数','失败次数']
                },
                xAxis: [
                    {
                        data: _xDateList,
                        boundaryGap : false,//类目起始和结束两端空白策略，见下图，默认为true留空，false则顶头
                        name:'日期',
                        axisLabel: {
                            show: true,
                            interval: 0
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '次数',
                        boundaryGap:['0%', '1%'],
                        min: min,
                        max: max
                    }
                ],
                series: [
                    {
                        type: 'line',
                        data: _yTotalList,
                        name: '请求次数',
                        itemStyle:{
                            normal:{
                                color:'#FF8800'
                            }
                        },
                        smooth: true
                    },
                    {
                        type: 'line',
                        data: _ySucList,
                        name: '成功次数',
                        itemStyle:{
                            normal:{
                                color:'#06CE06'
                            }
                        },
                        smooth: true
                    },
                    {
                        type: 'line',
                        data: _yFailList,
                        name: '失败次数',

                        itemStyle:{
                            normal:{
                                color:'#EA3200'
                            }
                        },
                        smooth: true
                    }
                ],
                grid: {
                    x: 80,
                    x2:40,
                    y: 40
                }
            };
            vm.myChart.setOption(option);
            window.onresize = vm.myChart.resize;
        };
        vm.goToApiPage = function(times,status){
            $state.go('^.log.api',{cusId:vm.cusId,startTime:times,endTime:times+24*3600*1000,status:status},{reload:true});
        }
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
    }]);