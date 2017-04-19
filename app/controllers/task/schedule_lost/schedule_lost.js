'use strict';

angular.module('eayun.task')
    .controller('scheduleLostCtrl', ['ServicetaskService', 'eayunModal', 'toast', '$state', 'SysCode', 'eayunStorage',
        function (ServicetaskService, eayunModal, toast, $state, SysCode, eayunStorage) {
            var tasklist = this;
            var date = new Date() ;
            tasklist.beginTime = new Date(date.getTime() - 1 * 24 * 3600 * 1000);
            tasklist.endTime = date;
            tasklist.myTable = {
                source: '/api/ecmc/system/schedule/getLeakageTaskList',
                api: {},
                getParams: function () {
                    console.log(tasklist.jname);
                    return {
                        jname: tasklist.jname,
                        beginTime : tasklist.beginTime ? tasklist.beginTime.getTime() : null ,
                        endTime : tasklist.endTime ? tasklist.endTime.getTime() : null
                    };
                }
            };
            tasklist.doSearch = function () {
                tasklist.myTable.api.draw();
            };
        }
    ]).filter("timeShowType",function(){
    return function(input, cron){
        var detailDesc = "" ;
        var detailDescs = cron.split(' ') ;
        if (detailDescs.length == 6){
            detailDescs.push("*") ;
        }
        detailDescs.reverse().forEach(function(obj, index){
            if ("?" !== obj && "*" !== obj){
                if (index == 0){
                    detailDesc += (obj + "年") ;
                }else if (index == 1){
                    detailDesc += (function(input){
                        var indexInfo_Names     = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] ;
                        var indexInfo_Numbers = [] ;
                        for (var i = 1 ; i <= 7 ; i++){indexInfo_Numbers.push(i);}
                        var indexInfo_ShowNames = ["每周日", "每周一", "每周二", "每周三", "每周四", "每周五", "每周六"] ;
                        return indexInfo_ShowNames[(indexInfo_Numbers.indexOf(obj) == -1) ? indexInfo_Names.indexOf(obj) : indexInfo_Numbers.indexOf(obj)] ;
                    }(obj)) ;
                }else if (index == 2){
                    detailDesc += (function(input){
                        var indexInfo_Names     = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"] ;
                        var indexInfo_Numbers = [] ;
                        var indexInfo_ShowNames = [] ;
                        for (var i = 1 ; i <= 12 ; i++){
                            indexInfo_Numbers.push(i);
                            indexInfo_ShowNames.push("每年"+i+"月") ;
                        }
                        return indexInfo_ShowNames[(indexInfo_Numbers.indexOf(obj) == -1) ? indexInfo_Names.indexOf(obj) : indexInfo_Numbers.indexOf(obj)] ;
                    }(obj)) ;
                }else if (index == 3){
                    detailDesc += (function(input){
                        var indexInfo_Numbers = [] ;
                        var indexInfo_ShowNames = [] ;
                        for (var i = 1 ; i <= 31 ; i++){
                            indexInfo_Numbers.push(i);
                            indexInfo_ShowNames.push("每月"+i+"日") ;
                        }
                        return indexInfo_ShowNames[indexInfo_Numbers.indexOf(obj)] ;
                    }(obj)) ;
                }else{
                    var type = '' ;
                    switch (index){
                        case 4:
                            type = '时' ;break ;
                        case 5:
                            type = '分' ;break ;
                        case 6:
                            type = '秒' ;break ;
                    }
                    if (obj.indexOf('/') != -1){
                        //每隔多长时间
                        detailDesc += "每隔" +obj.split('/')[1]+type+"(第"+obj.split('/')[0]+ type +"开始) " ;
                    }else {
                        //按天来算
                        detailDesc += ("第" + (obj+type) + " ") ;
                    }
                }
            }
        });
        return (function(input){
                var dateTime = Number(input) / 1000 ;
                if (dateTime < 60){
                    return dateTime + " 秒" ;
                }else if (dateTime < 1 * 60 * 60){
                    if (dateTime % 60 == 0){
                        return dateTime/60 + " 分" ;
                    }else {
                        return dateTime/60 + " 分 " + dateTime%60 + " 秒" ;
                    }
                } else if (dateTime == 60 * 60){
                    return "1 小时" ;
                }else if (dateTime  == 24 * 60 * 60){
                    return "1 天" ;
                }else if("?" !== cron.split(' ')[5] && "*" !== cron.split(' ')[5]){
                    return "一周" ;
                }else{
                    return input ;
                }
            }(input)) + " --> " + detailDesc + " 执行" ;
    }
});