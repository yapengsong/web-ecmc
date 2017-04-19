/**
 * Created by Administrator on 2016/5/3.
 */
angular.module('eayun.workorder')
    .directive('orderListTimer', [function () {
        return {
            restrict: 'E',
            scope: {
                orderModel: '=orderModel'
            },
            link: function (scope, element, attrs) {
                var handler = null;//定时器
                var difftime = null;
                var remainTimes = null;
                var overTimes = null;
                var seconds = 0;
                var minutes = 0;
                var hours = 0;
                //正计时
                function up() {
                    scope.orderModel.listTimerDiff += 1000;
                    difftime = scope.orderModel.listTimerDiff;
                    //查看是否超过默认处理时间
                    overTimes = difftime / 1000;
                    seconds = parseInt(overTimes % 60);
                    minutes = parseInt(overTimes / 60);
                    if (minutes >= 60) {
                        hours = parseInt(minutes / 60);
                        minutes = minutes % 60;
                        hours = hours > 9 ? hours : "0" + hours;
                    }
                    minutes = minutes > 9 ? minutes : "0" + minutes;
                    seconds = seconds > 9 ? seconds : "0" + seconds;
                    if (hours > 0) {
                        element.html(hours + ":" + minutes + ":" + seconds);
                    } else {
                        element.html(minutes + ":" + seconds);
                    }
                }

                //倒计时
                var downTime = '';

                function down() {
                    if (downTime == '') {
                        downTime = scope.orderModel.listTimerDiff
                    }
                    downTime -= 1000;
                    difftime = downTime;
                    if (isNaN(difftime)) {
                        return;
                    }
                    if (difftime / 1000 / 60 >= 5 || difftime / 1000 / 60 <= 0) {
                        element.html("00:00");
                        clearInterval(handler);
                    } else {
                        remainTimes = difftime / 1000;
                        seconds = parseInt(remainTimes % 60);
                        minutes = parseInt(remainTimes / 60);
                        minutes = minutes > 9 ? minutes : "0" + minutes;
                        seconds = seconds > 9 ? seconds : "0" + seconds;
                        element.html(minutes + ":" + seconds);
                    }
                }

                function computeUseTime() {
                    var useTimes = scope.orderModel.listTimerDiff / 1000;
                    seconds = parseInt(useTimes % 60);
                    minutes = parseInt(useTimes / 60);
                    if (minutes >= 60) {
                        hours = parseInt(minutes / 60);
                        minutes = minutes % 60;
                        hours = hours > 9 ? hours : "0" + hours;
                    }
                    minutes = minutes > 9 ? minutes : "0" + minutes;
                    seconds = seconds > 9 ? seconds : "0" + seconds;
                    if (hours > 0) {
                        element.html(hours + ":" + minutes + ":" + seconds);
                    } else {
                        element.html(minutes + ":" + seconds);
                    }
                }

                if (scope.orderModel.workFalg == '0') {
                    scope.orderModel.listTimerDiff=scope.orderModel.workCreTime+(5*60*1000)-scope.orderModel.newDate;
                    if(scope.orderModel.listTimerDiff< 0 ){
                        scope.orderModel.listTimerDiff=0;
                    }
                    handler = setInterval(down, 1000);
                } else if (scope.orderModel.workFalg == '1') {
                    scope.orderModel.listTimerDiff=scope.orderModel.newDate-scope.orderModel.flowBeginTime;
                    if (scope.orderModel.flowRespondFalg == '1') {
                        handler = setInterval(up, 1000);
                    } else {
                        downTime = 5 * 60 * 1000 - scope.orderModel.listTimerDiff;
                        handler = setInterval(down, 1000);
                    }
                } else if (scope.orderModel.workFalg == '2') {
                    scope.orderModel.listTimerDiff=scope.orderModel.endtime-scope.orderModel.flowBeginTime;
                    setTimeout(computeUseTime(), 1000);
                }
                scope.$on('$destroy', function () {
                    clearInterval(handler);
                });
            }
        };
    }])
    .directive('orderTimer', [function () {//工单详情页面指令
        return {
            restrict: 'E',
            scope: {
                orderModel: '=orderModel'
            },
            link: function (scope, element, attrs) {
                var handler = null;//定时器
                var difftime = null;
                var remainTimes = null;
                var useTimes = null;
                var seconds = 0;
                var minutes = 0;
                var hours = 0;
                //正计时
                function up() {
                    scope.orderModel.listTimerDiff += 1000;
                    difftime = scope.orderModel.listTimerDiff;
                    if (isNaN(difftime)) {
                        return;
                    }
                    //已用时间
                    useTimes = difftime / 1000;
                    seconds = parseInt(useTimes % 60);
                    minutes = parseInt(useTimes / 60);
                    if (minutes >= 60) {
                        hours = parseInt(minutes / 60);
                        minutes = minutes % 60;
                        hours = hours > 9 ? hours : "0" + hours;
                    }
                    minutes = minutes > 9 ? minutes : "0" + minutes;
                    seconds = seconds > 9 ? seconds : "0" + seconds;
                    if (hours > 0) {
                        element.html(hours + ":" + minutes + ":" + seconds);
                    } else {
                        element.html(minutes + ":" + seconds);
                    }
                }

                //倒计时
                var downTime = '';

                function down() {
                    if (downTime == '') {
                        downTime = 5 * 60 * 1000 - scope.orderModel.listTimerDiff + 1000
                    }
                    downTime -= 1000;
                    difftime = downTime;
                    if (isNaN(difftime)) {
                        return;
                    }
                    if (difftime / 1000 / 60 >= 5 || difftime / 1000 / 60 <= 0) {
                        element.html("00:00");
                        clearInterval(handler);
                    } else {
                        remainTimes = difftime / 1000;
                        seconds = parseInt(remainTimes % 60);
                        minutes = parseInt(remainTimes / 60);
                        minutes = minutes > 9 ? minutes : "0" + minutes;
                        seconds = seconds > 9 ? seconds : "0" + seconds;
                        element.html(minutes + ":" + seconds);
                    }
                }

                function computeUseTime() {
                    if(isNaN(scope.orderModel.listTimerDiff) || scope.orderModel.listTimerDiff==null){
                        scope.orderModel.listTimerDiff=0;
                    }
                    var useTimes = scope.orderModel.listTimerDiff / 1000;
                    if(useTimes=="0"){
                        element.html("00:00");
                    }else{
                        seconds = parseInt(useTimes % 60);
                        minutes = parseInt(useTimes / 60);
                        minutes = minutes > 9 ? minutes : "0" + minutes;
                        seconds = seconds > 9 ? seconds : "0" + seconds;
                        if (minutes >= 60) {
                            hours = parseInt(minutes / 60);
                            minutes = minutes % 60;
                            hours = hours > 9 ? hours : "0" + hours;
                        }
                        if (hours > 0) {
                            element.html(hours + ":" + minutes + ":" + seconds);
                        } else {
                            element.html(minutes + ":" + seconds);
                        }
                    }

                }

                function pourtimestop() {//详情页面处理响应时间倒计时停止
                    var pourtime = 5;
                    var pour = scope.orderModel.flowRespondTime - scope.orderModel.flowBeginTime;
                    if(scope.orderModel.flowRespondTime==null ||　scope.orderModel.flowBeginTime==null || pour<=0){
                        pour=0;
                    }
                    if (pourtime * 60 * 1000 <= pour) {
                        element.html("00:00");
                    } else {
                        var diff = (pourtime * 60 * 1000 - pour) / 1000;
                        seconds = parseInt(diff % 60);
                        minutes = parseInt(diff / 60);
                        minutes = minutes > 9 ? minutes : "0" + minutes;
                        seconds = seconds > 9 ? seconds : "0" + seconds;
                        element.html(minutes + ":" + seconds);
                    }
                    clearInterval(handler);
                }

                if (scope.orderModel.workFalg == "2"||scope.orderModel.workFalg =="3"||scope.orderModel.workFalg == "4") {
                    scope.orderModel.listTimerDiff=scope.orderModel.endtime-scope.orderModel.flowBeginTime;
                    if (attrs.type == 'responseTime') {
                        pourtimestop();
                    } else {
                        computeUseTime();
                    }
                } else if (attrs.type == 'responseTime') {//响应时间
                    scope.orderModel.listTimerDiff=scope.orderModel.newDate-scope.orderModel.flowBeginTime;
                    if (scope.orderModel.flowRespondFalg == '1') {//已响应
                        setTimeout(pourtimestop(), 1000);
                    } else {//未响应
                        handler = setInterval(down, 1000);
                    }
                } else if(scope.orderModel.workFalg == '0') {
                    scope.orderModel.listTimerDiff=scope.orderModel.workCreTime+(5*60*1000)-scope.orderModel.newDate;
                    if(scope.orderModel.listTimerDiff< 0 ){
                        scope.orderModel.listTimerDiff=0;
                    }
                    handler = setInterval(down, 1000);
                }else{
                    scope.orderModel.listTimerDiff=scope.orderModel.newDate-scope.orderModel.flowBeginTime;
                    handler = setInterval(up, 1000);
                }
                scope.$on('$destroy', function () {
                    clearInterval(handler);
                });
            }
        };
    }]);