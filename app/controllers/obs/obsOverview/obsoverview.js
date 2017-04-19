/**
 * Created by cxy on 2016/3/25.
 */
'use strict';

angular.module('eayun.obs')
    .controller('ObsOverviewCtrl',['ObsService','$timeout','eayunModal','toast',function (ObsService,$timeout,eayunModal,toast) {
        var obsOverview=this;
        /**获取24小时新增*/
        ObsService.getNowCompareYesDay().then(function (data) {
            obsOverview.getNowCompareYesDay=data;
        });
        obsOverview.setShowTab = function (str) {
            obsOverview.showTab = str;
            obsOverview.title=ObsService.getTitle(str);
            ObsService.getRank(str).then(function (data) {
                obsOverview.data=data;
            });
        };
        /**获取排行榜信息*/
        obsOverview.setShowTab('storage');
        /**存储概览*/
        ObsService.getObsOverview().then(function (data) {
            obsOverview.overview=data;
        });
        /**阈值设置*/
        obsOverview.set= function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '阈值设置',
                width: '600px',
                templateUrl: 'controllers/obs/obsOverview/set/set.html',
                controller: 'ObsOVSetController',
                controllerAs:'threshold'
            });
            result.then(function (data) {
                ObsService.setThreshold(data).then(function () {
                    if(ObsService.checkSetThreshold(obsOverview.selectModel,obsOverview.startTime,obsOverview.endTime)) {
                        obsOverview.getChart(obsOverview.selectModel, obsOverview.startTime, obsOverview.endTime);
                    }
                });
            });
        };

        /**初始化查询时间*/
        var date=new Date();
        obsOverview.now=date;
        obsOverview.startTime=new Date(date.getTime()-6 * 24 * 3600 * 1000);
        obsOverview.endTime=date;
        /**查询*/
        obsOverview.selectModel="storage";
        obsOverview.query= function () {
            if(ObsService.checkOverview(obsOverview.selectModel,obsOverview.startTime,obsOverview.endTime)) {
                obsOverview.getChart(obsOverview.selectModel,obsOverview.startTime,obsOverview.endTime);
            }
        };
        /**切换下拉框*/
        obsOverview.change= function () {
            if(ObsService.checkOverview(obsOverview.selectModel,obsOverview.startTime,obsOverview.endTime)){
                obsOverview.getChart(obsOverview.selectModel,obsOverview.startTime,obsOverview.endTime);
            }
        };
        /**charts*/
       obsOverview.getChart= function (type,starttime,endtime) {
           ObsService.getChart(type,starttime,endtime).then(function (data) {
               obsOverview.myChart.clear();
               var option=ObsService.getOption(data,'overview');

               obsOverview.myChart.setOption(option);
               window.onresize = obsOverview.myChart.resize;
           });
       };
        obsOverview.getChart(obsOverview.selectModel,obsOverview.startTime,obsOverview.endTime);
    }]);
