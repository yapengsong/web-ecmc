'use strict';

angular.module('eayun.obs')
    .controller('cdnCtrl', ['$stateParams','eayunModal','toast','SysCode','cdnCustomers','cdnService',
        function ($stateParams,eayunModal,toast,SysCode,cdnCustomers,cdnService) {
        var vm=this;
        vm.cusList = cdnCustomers;  //开通过CDN的客户列表
        vm.customer = vm.cusList[0];//当前选中客户信息
        if(vm.customer==null){
            vm.customer = {
                cusId:''
            }
        };
        vm.domainList = [];         //客户所有加速域名下拉列表
        //更改客户
        vm.changeCus = function(){
            vm.domain = '';
            vm.cdnDomainTable.api.draw();
            vm.MonthDomainData();
            vm.allDomainList();
            vm.query();
        };
        //客户本月CDN流量
        vm.MonthDomainData = function(){
            cdnService.getMonthDomainData(vm.customer.cusId).then(function (data) {
                if(data.respCode == SysCode.success){
                    vm.usedInMonth=data.data;
                }else{
                }

            });
        };
        vm.MonthDomainData();
        //本月内使用CDN加速域名列表
        vm.cdnDomainTable={
            source: '/api/ecmc/obs/cdn/getmonthdomainpage',
            api: {},
            getParams: function () {
                return {
                    cusId : vm.customer.cusId
                };
            },
            result: []
        };
        vm.checkStatusClass =function (model,_index){
            vm.StatusClass[_index] = '';
            if(model.cdnStatus && model.cdnStatus=='2'){
                vm.StatusClass[_index] = 'green';
            }else if(model.cdnStatus=='1'){
                vm.StatusClass[_index] = 'yellow';
            }else{
                vm.StatusClass[_index] = 'gray';
            }
            return vm.StatusClass[_index];
        };
        vm.queryDomain = function(domainId){
            vm.domain = domainId;
            vm.params.domain = vm.domain;
            vm.query();
        };
        vm.domain = '';
        vm.now=new Date();
        vm.endTime=vm.now;
        vm.startTime=new Date(vm.endTime.getTime()-6 * 24 * 3600 * 1000);
        vm.params = {
            cusId:vm.customer.cusId,
            domain:vm.domain,
            startTime:vm.startTime.getTime(),
            endTime:vm.endTime.getTime()
        };
        //客户所有加速域名下拉列表
        vm.allDomainList = function(){
            cdnService.getAllDomainList(vm.customer.cusId).then(function (data) {
                if(data.respCode == SysCode.success){
                    vm.domainList=data.data;
                }else{
                }
            });
        };
        vm.allDomainList();
        vm.changeDomain = function(){
            vm.params.domain = vm.domain;
            vm.query();
        }
        //查询按钮
        vm.query = function(){
            if(vm.checkQuery(vm.customer.cusId,vm.startTime,vm.endTime)){
                vm.params = {
                    cusId:vm.customer.cusId,
                    domain:vm.domain,
                    startTime:vm.startTime.getTime(),
                    endTime:vm.endTime.getTime(),
                    type:'CDN'
                };
                vm.getChart(vm.params);
            };
        };
        //图表
        vm.getChart= function (params) {
            vm.show=true;
            cdnService.getDomainData(params).then(function (data) {
                if(data.respCode == SysCode.success){
                    vm.xTime=data.data.xTime;
                    vm.cdnData=data.data.yData;
                    vm.cdnMax=data.data.yDataMax; //最大值
                    vm.cdnMin=data.data.yDataMin; //最小值
                    params.type='BACK';
                    cdnService.getDomainData(params).then(function (data) {
                        if(data.respCode == SysCode.success){
                            vm.backData=data.data.yData;
                            vm.backMax=data.data.yDataMax; //最大值
                            vm.backMin=data.data.yDataMin; //最小值

                            vm.myChart.clear();
                            vm.maxData=Number(vm.cdnMax) > Number(vm.backMax)?vm.cdnMax:vm.backMax;
                            vm.minData=Number(vm.cdnMin) < Number(vm.backMin)?vm.cdnMin:vm.backMin;
                            vm.option=vm.getOption(vm.maxData,vm.minData,vm.xTime,vm.cdnData,vm.backData);
                            vm.myChart.setOption(vm.option);
                            window.onresize = vm.myChart.resize;
                        }else{
                        }
                    });
                }else{
                }
            });

        };
        vm.checkQuery = function(cusId,startTime,endTime){
            if(cusId==null||cusId.length<=0){
                toast.error('请选择客户!');
                return false;
            }
            if((startTime==null||startTime.length<=0)&&(endTime==null||endTime.length<=0)){
                toast.error('查询时间不能为空!');
                return false;
            }
            if(startTime==null||startTime.length<=0){
                toast.error('开始时间不能为空!');
                return false;
            }
            if(endTime==null||endTime.length<=0){
                toast.error('结束时间不能为空!');
                return false;
            }
            var ms =endTime.getTime()-startTime.getTime();
            var days = ms/1000/60/60/24;
            if(days >= 60){
                toast.error('时间范围不能大于60天');
                return false;
            }
            return true;
        };
            //max min time cdnData backData
        vm.getOption= function (dataMax,dataMin,xTime,cdnData,backData) {
            vm.yAxixName='流量详情(MB)';
            vm.unit='(MB)';
            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend:{
                    data:['CDN下载流量(MB)','回源流量(MB)']
                },
                xAxis: [
                    {
                        name:'日期',
                        data: xTime
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: vm.yAxixName,
                        min: dataMin,
                        max: dataMax
                    }
                ],
                series: [
                    {
                        name: 'CDN下载流量(MB)',
                        type: 'line',
                        data: cdnData,
                        itemStyle:{
                            normal:{
                                color:'#FF8800'
                            }
                        },
                        smooth: true
                    },
                    {
                        name: '回源流量(MB)',
                        type: 'line',
                        data: backData,
                        itemStyle:{
                            normal:{
                                color:'#36C0DA'
                            }
                        },
                        smooth: true
                    }
                ],
                grid:{
                    x:80,
                    x2:80,
                    y2:50
                }
            };
            return option;
        };
        //vm.query();
    }]);