/**
 * Created by Administrator on 2016/4/19.
 */
'use strict'

angular.module('eayun.customer')
    .controller('GramCtrl',['hismodel','$scope','$interval','$location',function (hismodel,$scope,$interval,$location) {
        var vm = this;
        var xTime = [];
        var yUp = [];
        var yDown = [];
        vm.gram=hismodel.detailsList;
        var num = 0;
        var hight = 25;
        if(hismodel.detailsList.length<=9){
            num = 0;
            hight = 25;
        }else if(hismodel.detailsList.length>9&&hismodel.detailsList.length<=30){
            num = -30;
            hight = 60;
        }else{
            num = -90;
            hight = 80;
        }
        angular.forEach(vm.gram, function (value,key) {
            var time = value.everyDate.substring(0,10).split('-').join('/');
            var up = value.upCount;
            var down = value.downCount;
            xTime.push(time);
            yUp.push(up);
            yDown.push(down);
        });
        $scope.pushChart = function(){
            var myChart=echarts.init(document.getElementById('histog'));
            window.onresize = myChart.resize;
            myChart.showLoading({
                text: '正在努力的读取数据中...',
            });
            myChart.hideLoading();
            var option = {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['上行流量','下行流量']
                },
                toolbox: {
                    show : false,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : false,//false，是否启用拖拽重计算特性，默认关闭
                grid :{
                    y:30,
                    y2:hight
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : true,//类目起始和结束两端空白策略，见下图，默认为true留空，false则顶头
                        data : xTime,
                        axisLabel : {
                            show:true,
                            interval: 0,
                            rotate:num
                        },
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                    }
                ],
                series : [
                    {
                        name:'上行流量',
                        type:'bar',
                        data:yDown,	//上行：down
                    },
                    {
                        name:'下行流量',
                        type:'bar',
                        data:yUp,	//下行：up
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
