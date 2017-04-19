/**
 * Created by eayun on 2016/3/28.
 */
'use strict'

angular.module('eayun.monitor')
    .controller('ApiServiceCtrl', ['MonitorService', 'SysCode','$timeout','$scope', function (MonitorService, SysCode,$timeout,$scope) {
        var ai = this ;
        //所有的列表相关分页参数都放在这里
        //region  表示数据中心ID
        ai.queryParams = {} ;
        //Key 和 Value的对应关系
        ai.search = '';


        /*初始化没有排序*/
        ai.initialize  = function () {
            ai.resourceType = '';
            ai.sort='';
            ai.sortKeyongClass        = 'glyphicon glyphicon-sort';
            ai.sortRightClass         = 'glyphicon glyphicon-sort';
            ai.sortRequestNumberClass = 'glyphicon glyphicon-sort';
            ai.sortDealTimeClass      = 'glyphicon glyphicon-sort';
        };
        ai.initialize();
        ai.changeResSort = function (_resourceType) {
            if(ai.resourceType!=_resourceType){
                ai.initialize();
            }
            ai.resourceType = _resourceType;
            switch (ai.sort) {
                case ''     :
                    ai.sort = 'DESC';
                    ai.sortClass = 'glyphicon glyphicon-arrow-down';
                    break;
                case 'DESC' :
                    ai.sort = 'ASC';
                    ai.sortClass = 'glyphicon glyphicon-arrow-up';
                    break;
                case 'ASC'  :
                    ai.sort = 'DESC';
                    ai.sortClass = 'glyphicon glyphicon-arrow-down';
                    break;
            };

            switch (_resourceType) {
                case 'Keyong'     :
                    ai.sortKeyongClass = ai.sortClass;
                    break;
                case 'Right' :
                    ai.sortRightClass = ai.sortClass;
                    break;
                case 'RequestNumber'  :
                    ai.sortRequestNumberClass = ai.sortClass;
                    break;
                case 'DealTime'     :
                    ai.sortDealTimeClass = ai.sortClass;
                    break;
            };
            ai.apiserviceTable.api.draw();
        };


        ai.queryInterval = {};
        ai.dataType = 'real-time';
        MonitorService.getInterval().then(function (response) {
            if (response.data.respCode == SysCode.success) {
                ai.queryInterval = response.data.data;
            }
        });
        ai.dcResourceList = {};

        MonitorService.getDcResourceList().then(function (response) {
            ai.dcResourceList = response.data;
            ai.dcResourceList.push({
                "apiDcCode":"----",
                "id":"-"
            }) ;
        });
        ai.query = {
            dcName: ''
        };
        ai.options = {
            searchFn: function () {
                ai.initialize();
                ai.apiserviceTable.api.draw();
            },
            select: [{cus: '名称'}, {ip: 'IP'}],
            series: {
            },
            checkbox: true
        };
        ai.queryTable = function () {
            if (ai.prevDataType == "group") {
                //如果是列表展示实时数据类型的话，才需要每次刷新最新的数据时间，查询数据以显示
                ai.endDate = new Date();
            }
            ai.initialize();
            ai.apiserviceTable.api.draw();
        };

        var prevData ;
        ai.prevDataType = "group" ;
        ai.queryTableTwoType = function (){
            //第一组时间范围，选择时间可以精确到时分秒
            var group1 = ['30','60','360','720','1440'] ;
            //第二组时间范围，选择时间只能精确到年月日
            var group2 = ['10080','21600','43200'] ;
            if (ai.dataType == 'real-time'){
                ai.prevDataType = "group" ;
            }
            if (group1.indexOf(ai.dataType) != -1){
                //group1
                if (ai.prevDataType != "group1"){
                    ai.endDate = new Date();
                    prevData = ai.endDate ;
                    ai.prevDataType = "group1" ;
                }
            }
            if (group2.indexOf(ai.dataType) != -1){
                //group2
                if (ai.prevDataType != "group2"){
                    ai.endDate = new Date(new Date().toLocaleDateString());
                    prevData = ai.endDate ;
                    ai.prevDataType = "group2" ;
                }
            }
            ai.initialize();
            ai.apiserviceTable.api.draw();
        };
        ai.apiserviceTable = {
            source: '/api/ecmc/monitor/resource/getApiIndicatorData',
            api: {},
            getParams: function () {
                return {
                    ip : (ai.search.key == 'ip' ? ai.search.value : null),
                    cusName : (ai.search.key == 'cus' ? ai.search.value : null) ,
                    regionName : ai.queryParams.region,
                    endDate : (ai.endDate ? ai.endDate.getTime() : null),
                    dataType : ai.dataType,
                    orderBy: ai.resourceType,
                    sort: ai.sort
                } ;
            }
        }

        /**
         * 根据产品需求说明，历史数据截止时间日期不能为空，
         * 故设置为当点击清空操作的时候，将时间设置为上一次设定的时间
         * @type {Date|*}
         */
        ai.queryTableFromDate = function(){
            if (ai.endDate){
                prevData = ai.endDate ;
            }else{
                ai.endDate = prevData ;
            }
            ai.initialize();
            ai.apiserviceTable.api.draw();
        }

        //每隔二十秒刷新页面列表内容
        var timer;
        ai.flush= function () {
            timer=$timeout(function(){
                if(ai.dataType=='real-time'){
                    ai.apiserviceTable.api.draw();
                }
            },60000);//要求设置为默认按照一分钟的频率进行刷新
            timer.then(function () {
                ai.flush();
            });
        };
        ai.flush();
        $scope.$on('$destroy', function () {
            $timeout.cancel(timer);
        });
    }])
    .filter('arrowApiData', [function () {
        return function (data) {
            var arrow = '';
            switch (data) {
                case 1:
                    arrow = '↑';
                    break;
                case 0:
                    arrow = '—';
                    break;
                case -1:
                    arrow = '↓';
                    break;
            }
            return arrow;
        }
    }])
    .filter('showInt', [function () {
        return function () {
            return Math.round(data) ;
        }
    }]);