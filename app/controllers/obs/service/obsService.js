/**
 * Created by cxy on 2016/3/25.
 */
'use strict';

angular.module('eayun.obs')
    .service('ObsService', ['$http','toast','SysCode','$q', function ($http,toast,SysCode,$q) {
        var obsService = {};
        /**获取24小时新增*/
        obsService.getNowCompareYesDay = function(){
            return $http.post('/api/ecmc/obs/obsview/getObs24View', {})
                .then(function (response) {
                    return response.data;
                });
        };
        /**获取存储概览*/
        obsService.getObsOverview= function () {
            return $http.post('/api/ecmc/obs/obsview/getObsView', {})
                .then(function (response) {
                    return response.data;
                });
        };
        /**echarts*/
        obsService.getChart= function (type,starTime,endTime) {
            starTime=starTime.getTime();
            endTime=endTime.getTime();
            return $http.post('/api/ecmc/obs/obsview/getChart', {type:type,startTime:starTime,endTime:endTime})
                .then(function (response) {
                    return response.data;
                });
        };
        /**获取option*/
        obsService.getOption= function (data,markLineType) {
            var storageQuota=data.storageQuota;
            storageQuota=storageQuota*1024;
            var requestQuota=data.requestQuota;
            requestQuota=requestQuota*10000;
            var loadFlowQuota=data.loadFlowQuota;
            loadFlowQuota=loadFlowQuota*1024;
            var yDataMax=data.yDataMax;
            var yDataMin=data.yDataMin;
            var xData=data.xTime;
            var yData=data.yData;
            var type=data.type;
            var yAxixName='';
            var unit='';
            var max=data.originalDataMax;
            var quota=-1;
            if(type=='storage'){
                yAxixName='存储量(MB)';
                unit='(MB)';
                quota=storageQuota;
            }else if(type=='loadFlow'){
                yAxixName='下载流量(MB)';
                unit='(MB)';
                quota=loadFlowQuota;
            }else if(type=='request'){
                yAxixName='请求次数(次)';
                unit='(次)';
                quota=requestQuota;
            }
            var option = {
                tooltip: {
                    formatter: '{a} <br/>{b} : {c}',
                    trigger: 'axis'
                },
                xAxis: [
                    {
                        name:'日期',
                        data: xData
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: yAxixName,
                        min:yDataMin,
                        max:yDataMax
                    }
                ],
                series: [
                    {
                        name:yAxixName,
                        type: 'line',
                        data: yData,
                        itemStyle:{
                            normal:{
                                color:'#FF8800'
                            }
                        },
                        smooth: true
                    }
                ],
                grid:{
                    x:100,
                    x2:100,
                    y2:100
                }
            };
            var markLineName='';
            if(markLineType=='user'){
                markLineName='配额线';
            }else if(markLineType=='overview'){
                markLineName='阈值线';
            }
            if(1.5*max>quota&&quota>0){
                if(quota>max*1.2) {
                    option.yAxis[0].max = quota;
                }
                option.series[0].markLine={
                    data: [
                            [
                                {
                                    name: markLineName,
                                    coord: [0, quota],
                                    value:quota
                                },
                                {
                                    coord: [xData.length-1, quota]
                                }
                            ]
                        ],
                    lineStyle:{
                        normal:{
                            color:'#FF0000'
                        }
                    }
                };
            }
            return option;
        };
        obsService.checkOverview = function(selectModel,startTime,endTime){

            if(selectModel==null||selectModel.length<=0){
                toast.error('请选择查询类别!');
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
        obsService.checkSetThreshold = function(selectModel,startTime,endTime){

            if(selectModel==null||selectModel.length<=0){
                return false;
            }
            if((startTime==null||startTime.length<=0)&&(endTime==null||endTime.length<=0)){
                return false;
            }
            if(startTime==null||startTime.length<=0){
                return false;
            }
            if(endTime==null||endTime.length<=0){
                return false;
            }
            var ms =endTime.getTime()-startTime.getTime();
            var days = ms/1000/60/60/24;
            if(days >= 60){
                return false;
            }
            return true;
        };
        obsService.getTitle= function (str) {
            var title='';
            if(str=='storage'){
                title='占用存储空间大小(MB)';
            }else if(str=='loadFlow'){
                title='使用流量大小(MB)';
            }else{
                title='请求次数(万次)';
            }
            return title;
        }
        /**获取底部排行榜*/
        obsService.getRank= function (type) {

            return $http.post('/api/ecmc/obs/obsview/getTop10', {type:type})
                .then(function (response) {
                    if(response.data.code!='010120'){
                        return response.data;
                    }else{
                        return ;
                    }

                });
        };
        /***********************总览设置***************************/
        /**获取阈值*/
        obsService.getThreshold= function () {
            return $http.post('/api/ecmc/obs/obsview/getThreshold',{}).then(function (response) {
                return response.data;
            });
        };
        /**设置阈值*/
        obsService.setThreshold= function (data){
            return $http.post('/api/ecmc/obs/obsview/setThreshold',{usedStorage:data.usedStorage,loadDown:data.loadDown,requestCount:data.requestCount}).then(function (response) {
                switch (response.data.code) {
                    case SysCode.error:
                        toast.error('设置阈值失败!');
                        break;
                    case  SysCode.success:
                        toast.success('设置阈值成功!');
                        break;
                    //default:
                    //    toast.running('设置阈值中!');
                }
            });
        };
/************************客户详情*******************************/
        /**获取obs客户下拉框*/
        obsService.getObsCusList= function () {
            return $http.post('/api/ecmc/obs/obscustomer/getObsCustomer', {})
                .then(function (response) {
                    return response.data;
                });
        };
        /**获取客户下的bucket列表*/
        obsService.getBucketList= function (cusId) {
            return $http.post('/api/ecmc/obs/obscustomer/getAllBucketsByCusId',{'cusId':cusId})
                .then(function (response) {
                    return response.data;
                });
        };
        /**获取客户本月使用量信息*/
        obsService.getObsInMonthUsed= function (cusId) {
            return $http.post('/api/ecmc/obs/obscustomer/getObsInMonthUsed',{'cusId':cusId})
                .then(function (response) {
                    return response.data;
                });
        };
        /**echarts*/
        obsService.getCusChart= function (cusId,bucketName,type,startDate,endDate) {
            startDate=startDate.getTime();
            endDate=endDate.getTime();
            return $http.post('/api/ecmc/obs/obscustomer/getObsUsedView', {cusId:cusId,bucketName:bucketName,type:type,startTime:startDate,endTime:endDate})
                .then(function (response) {
                    return response.data;
                });
        };
        /**获取历史账单*/
        obsService.getObsHistoryResources= function (cusId) {
            var table={
                source: '/api/ecmc/obs/obscustomer/getObsHistoryResources',
                api: {},
                getParams: function () {
                    return {
                        cusId : cusId
                    };
                }
            };
            return table;
        };
        /**检验查询条件*/
        obsService.checkQuery = function(cusId,bucketName,selectModel,startTime,endTime){
            if(cusId==null||cusId.length<=0){
                toast.error('请选择客户!');
                return false;
            }
            if(bucketName==null||bucketName.length<=0){
                toast.error('请选择bucket!');
                return false;
            }
            if(selectModel==null||selectModel.length<=0){
                toast.error('请选择查询类别!');
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
        obsService.checkSelect = function(cusId,bucketName,selectModel,startTime,endTime){
            if(cusId==null||cusId.length<=0){
                return false;
            }
            if(bucketName==null||bucketName.length<=0){
                return false;
            }
            if(selectModel==null||selectModel.length<=0){
                return false;
            }
            if((startTime==null||startTime.length<=0)&&(endTime==null||endTime.length<=0)){
                return false;
            }
            if(startTime==null||startTime.length<=0){
                return false;
            }
            if(endTime==null||endTime.length<=0){
                return false;
            }
            var ms =endTime.getTime()-startTime.getTime();
            var days = ms/1000/60/60/24;
            if(days >= 60){
                return false;
            }
            return true;
        };
        /**判断客户是否为空*/
        obsService.checkCusId= function (cusId) {
            if(cusId==null||cusId.length<=0){
                toast.error('请选择客户!');
                return false;
            }
            return true;
        };
        /****************************设置配额********************************/
        /**获取配额*/
        obsService.getQuota= function (cusId) {
            return $http.post('/api/ecmc/obs/obscustomer/getQuota',{cusId:cusId}).then(function (response) {
                return response.data;
            });
        };
        /**设置配额*/
        obsService.setQuota= function (cusId,obs) {
            return $http.post('/api/ecmc/obs/obscustomer/setQuota',{cusId:cusId,storage:obs.storage}).then(function (response) {
                switch (response.data.code) {
                    case SysCode.error:
                        toast.error('设置配额失败!');
                        break;
                    case  SysCode.success:
                        toast.success('设置配额成功!');
                        break;
                    //default:
                    //    toast.running('设置阈值中!');
                }
            });
        };
        /**校验*/
        obsService.check= function (value,inputFormat) {
            var flag=false;
            if(inputFormat.test(value)){
                flag=true;
            }else {
                flag=false;
            }
            return flag;
        };
        return obsService;
    }]);

