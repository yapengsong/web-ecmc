/**
 * Created by LJG on 2016/11/04.
 */
'use strict';

angular.module('eayun.overview')
    .controller('HistogramCtrl', ['OverViewService','Model','$scope','$interval', function (OverViewService,Model,$scope,$interval) {
        var vm = this;
        var colorbule = "#4f81bd";
        var colorred = "#ff0000";
        var hight = 25;
        var num = 0;
        var xTitle = ['CPU(核)','内存(G)','存储(G)','带宽(Mbps)','公网IP(个)'];
        var cunchu = "0.00";
        if(Model.dataCapacityQuato*1>0){
        	cunchu = ((Model.usedVolumeCapacity+Model.usedVolSnapshotSum)/(Model.dataCapacityQuato*1024)*100).toFixed(2);
        }
        var IP = ((Model.allotFloatIpCount+Model.usedRoute+Model.usedDHCP)/Model.floatIpCountQuato*100).toFixed(2);
        var neicun = "0.00";
        if(Model.memoryQuato*1>0){
        	neicun = (Model.usedMemoryCount/1024/Model.memoryQuato*100).toFixed(2);
        }
		var daikuan = (Model.usedRouteCount/Model.bandWidthQuato*100).toFixed(2);
		var cpul = "0.00";
		if(Model.cpuQuato*1>0){
			cpul = (Model.usedCpuCount/Model.cpuQuato*100).toFixed(2);
		}
		var colorList = [];
        var xDate = [cpul,neicun,cunchu,daikuan,IP];
        if(Model.cpuQuato<=0){
			colorList[0]=colorred;
		}else {
			colorList[0]=colorbule;
		}
		if(Model.memoryQuato<=0){
			colorList[1]=colorred;
		}else {
			colorList[1]=colorbule;
		}
		if(Model.dataCapacityQuato<=0){
			colorList[2]=colorred;
		}else {
			if(cunchu*1>100){
				colorList[2]=colorred;
			}else{
				colorList[2]=colorbule;
			}
		}
		if(Model.bandWidthQuato<=0){
			colorList[3]=colorred;
		}else {
			colorList[3]=colorbule;
		}
		if(Model.floatIpCountQuato<=0){
			colorList[4]=colorred;
		}else {
			colorList[4]=colorbule;
		}
        var yDate = ['0%','100%','200%','300%','400%','500%','600%','700%','800%','900%'];
        $scope.pushChart = function(){
        	var myChart=echarts.init(document.getElementById('his'));
            window.onresize = myChart.resize;
            myChart.showLoading({
                text: '正在努力的读取数据中...',
                color: colorbule,
            });
	        var option = {
	            tooltip : {
	                trigger: 'axis'
	            },
	            title: {
	            	show:true,
	            	x:'center',
	                text:'云资源使用率('+Model.name+')'
	            },
	            toolbox: {
	                show : false,
	                feature : {
	                    mark : {show: false},
	                    dataView : {show: false, readOnly: false},
	                    magicType : {show: false, type: ['bar']},
	                    restore : {show: false},
	                    saveAsImage : {show: false}
	                }
	            },
	            calculable : true,//false，是否启用拖拽重计算特性，默认关闭
	            
	            xAxis : [
	                {
	                	name: '资源',
	                    type : 'category',
	                    boundaryGap : true,//类目起始和结束两端空白策略，见下图，默认为true留空，false则顶头
	                    data : xTitle,
	                    axisLabel : {
	                        show:true,
	                        interval: 0,
	                        rotate:num
	                    },
	                }
	            ],
	            yAxis : [
	                {
	                	name:'使用率（%）',
	                    type : 'value'
	                }
	            ],
	            series : [
	               {
	            	   name:'',
	                   type:'bar',
	                   itemStyle: {
	                	   normal:{
	                		   label:{
	                			   show:true,
	                			   position:'top',
	                			   formatter: '{c} %',
	                			   textStyle: {  
	                				   fontWeight:'bolder',  
	                				   fontSize : '12',  
	                				   color: function(params) {
	    	                			   return colorList[params.dataIndex]
	    	                		   },
	                				   fontFamily : '微软雅黑' 
	                			   }  
	                		   },
	                		   color: function(params) {
	                			   return colorList[params.dataIndex]
	                		   }
	                	   }
	                   },
	                   data:xDate
	               }
	           ]
	        };
	        myChart.setOption(option);
	        myChart.hideLoading();
        }
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