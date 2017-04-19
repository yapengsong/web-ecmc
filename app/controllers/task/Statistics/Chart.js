/**
 * Created by Administrator on 2016/6/22 0022.
 */
/**
 * Created by Administrator on 2016/4/19.
 */
'use strict'

angular.module('eayun.task')
    .controller('chartCtrl', ['statisticsModel', '$scope', '$interval', '$location', function (statisticsModel, $scope, $interval, $location) {
        var vm = this;
        //console.info(statisticsModel);
        vm.gram = statisticsModel.xData;

        var num = 0;
        var hight = 25;
        if (vm.gram.length <= 9) {
            num = 0;
            hight = 25;
        } else if (vm.gram.length > 9 && vm.gram.length <= 30) {
            num = -30;
            hight = 60;
        } else {
            num = -90;
            hight = 80;
        }
        $scope.pushChart = function () {
            var myChart = echarts.init(document.getElementById('taskChart'));
            console.info(myChart);
            //window.onresize = myChart.resize;
            myChart.showLoading({
                text: '正在努力的读取数据中...',
            });
            myChart.hideLoading();
            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['成功量', '失败量']
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                calculable: false,//false，是否启用拖拽重计算特性，默认关闭
                grid: {
                    y: 30,
                    y2: hight
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: true,//类目起始和结束两端空白策略，见下图，默认为true留空，false则顶头
                        data: statisticsModel.xData,
                        axisLabel: {
                            show: true,
                            interval: 0,
                            //rotate: num
                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                    }
                ],
                series: [
                    {
                        name: '成功量',
                        type: 'bar',
                        data: statisticsModel.ySucData,
                    },
                    {
                        name: '失败量',
                        type: 'bar',
                        data: statisticsModel.yFalData,
                    }
                ]
            };

            myChart.setOption(option);
        };
        var promise = null;
        var sec = 1;
        $scope.updateClock = function(){
            sec--;
            if(sec <= 0){
                $scope.pushChart();
                $interval.cancel(promise);
            }
        };
        promise = $interval(function(){
            $scope.updateClock();
        },500);
    }]);
