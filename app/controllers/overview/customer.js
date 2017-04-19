/**
 * Created by LJG on 2016/11/07.
 */
'use strict';

angular.module('eayun.overview')
    .controller('OverviewCustomerCtrl', ['OverViewService','$scope','$interval','$timeout', function (OverViewService,$scope,$interval,$timeout) {
        var vm = this;
        var colorbule = "#4f81bd";
        vm.projects = {};
        vm.yuarslist = {};
        $scope.getNowData = function(){
	        OverViewService.getYears().then(function (data) {
	        	vm.yuarslist = data.data;
	        });
	    }
        var getData = null;
        var getDatasec = 1;
        $scope.updateGetData = function(){
        	getDatasec--;
            if(getDatasec <= 0){
                $scope.getNowData();
                $interval.cancel(getData);
            }
        };
        getData = $interval(function(){
        	$scope.updateGetData();
        },1000);
        var myChart=echarts.init(document.getElementById('hiscus'));
        myChart.showLoading({
            text: '正在努力的读取数据中...',
            color: colorbule,
        });
        $scope.pushChart = function(){
        	OverViewService.getProjectTypeList().then(function (data) {
            	vm.projects = data.data;
            	var allPrjs = vm.projects.all_prjs;
                var formalCusPrjs = vm.projects.formal_cus_prjs;
                var cooperationCusPrjs = vm.projects.cooperation_cus_prjs;
                var testCusPrjs = vm.projects.test_cus_prjs;
                var oneselfCusPrjs = vm.projects.oneself_cus_prjs;
                var otherCusPrjs = vm.projects.other_cus_prjs;
                var freezeCusPrjs = vm.projects.freeze_cus_prjs;
                var xTitle = ['项目总数','正式用户','合作客户','测试用户','已冻结用户','公司自用用户','其他'];
                var xDate = [allPrjs,formalCusPrjs,cooperationCusPrjs,testCusPrjs,freezeCusPrjs,oneselfCusPrjs,otherCusPrjs];
    	        
    	        var option = {
    	            tooltip : {
    	                trigger: 'axis'
    	            },
    	            title: {
    	            	show:true,
    	            	x:'center',
    	                text:'项目类型统计'
    	            },
    	            toolbox: {
    	                show : false,
    	                feature : {
    	                    mark : {show: false},
    	                    dataView : {show: false, readOnly: false},
    	                    magicType : {show: true, type: ['line', 'bar']},
    	                    restore : {show: false},
    	                    saveAsImage : {show: false}
    	                }
    	            },
    	            calculable : true,//false，是否启用拖拽重计算特性，默认关闭
    	            
    	            xAxis : [
    	                {
    	                	name: '客户类型',
    	                    type : 'category',
    	                    boundaryGap : true,//类目起始和结束两端空白策略，见下图，默认为true留空，false则顶头
    	                    data : xTitle,
    	                    axisLabel : {
    	                        show:true,
    	                        interval: 0,
    	                        rotate:0
    	                    },
    	                }
    	            ],
    	            yAxis : [
    	                {
    	                	name:'占有项目数(个)',
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
    	                			   formatter: '{c} 个',
    	                			   textStyle: {  
    	                				   fontWeight:'bolder',  
    	                				   fontSize : '12', 
    	                				   color: colorbule,
    	                				   fontFamily : '微软雅黑' 
    	                			   }  
    	                		   },
    	                		   color: colorbule //连线颜色
    	                	   }
    	                   },
    	                   data:xDate
    	               }
    	           ]
    	        };
    	        myChart.setOption(option);
    	        myChart.hideLoading();
            });
        	
	       
        }
        var promise = null;
        promise = $interval(function(){
            $scope.pushChart();
        },5000);
////////////////////////////月开通量//////////////////////////////////
        vm.monthsData = {};
        var monthsChart=echarts.init(document.getElementById('hisnewcus'));
        monthsChart.showLoading({
            text: '正在努力的读取数据中...',
            color: colorbule,
        });
        $scope.monthsChart = function(type){
        	if(type=="" || type=="undefined"){
        		type="now";
        	}
        	var xTitle;
        	var xDate;
        	
        	OverViewService.getMonthsNewCus(type).then(function (data) {
            	vm.monthsData = data.data;
            	if("undefined"!=vm.monthsData && vm.monthsData!=""){
            		xTitle = vm.monthsData.xTitle;
            		xDate = vm.monthsData.xData;
            	}
            	 var optionMonth = {
         	            tooltip : {
         	                trigger: 'axis'
         	            },
         	            title: {
         	            	show:true,
         	            	x:'center',
         	                text:'月度客户开通数量统计'
         	            },
         	            toolbox: {
         	                show : false,
         	                feature : {
         	                    mark : {show: false},
         	                    dataView : {show: false, readOnly: false},
         	                    magicType : {show: true, type: ['line', 'bar']},
         	                    restore : {show: false},
         	                    saveAsImage : {show: false}
         	                }
         	            },
         	            calculable : true,//false，是否启用拖拽重计算特性，默认关闭
         	            
         	            xAxis : [
         	                {
         	                	name: '月份',
         	                    type : 'category',
         	                    boundaryGap : true,//类目起始和结束两端空白策略，见下图，默认为true留空，false则顶头
         	                    data : xTitle,
         	                    axisLabel : {
         	                        show:true,
         	                        interval: 0,
         	                        rotate:30
         	                    },
         	                }
         	            ],
         	            yAxis : [
         	                {
         	                	name:'月开通量(个)',
         	                    type : 'value'
         	                }
         	            ],
         	            series : [
         	               {
         	            	   name:'',
         	                   type:'line',
         	                   itemStyle: {
         	                	   normal:{
         	                		   label:{
         	                			   show:true,
         	                			   position:'top',
         	                			   formatter: '{c} 个',
         	                			   textStyle: {  
         	                				   fontWeight:'bolder',  
         	                				   fontSize : '12', 
         	                				   color: colorbule,
         	                				   fontFamily : '微软雅黑' 
         	                			   }  
         	                		   },
         	                		  color: colorbule
         	                	   }
         	                   },
         	                   lineStyle:{ 
         	                	   normal:{ 
         	                		   width:1, //连线粗细 
         	                		   color: colorbule //连线颜色 
         	                	   }
         	                   },
         	                   data:xDate
         	               }
         	           ]
         	        };
            	 monthsChart.setOption(optionMonth);
         	     monthsChart.hideLoading();
            });
        	
        }
        var type = "now";
        var monthspromise = null;
        var changepromise = null;
        var monthssec = 1;
        $scope.updateClock = function(){
        	monthssec--;
        	$scope.monthsChart(type);
            if(monthssec <= -1){
                $interval.cancel(changepromise);
                monthssec = 1;
            }
        };
        vm.change = function(){
        	$interval.cancel(monthspromise);//清除刷新
        	type=vm.time;
        	console.info(type);
        	if(type == "now"){//每5s刷新一次
            	monthspromise = $interval(function(){
                	$scope.monthsChart(type);
                },5000);
            }else{
                changepromise = $interval(function(){
                	$scope.updateClock();
                },200);
            }
        }
        
        monthspromise = $interval(function(){
        	$scope.monthsChart(type);
        },5000);
        setTimeout(function (){
            window.onresize = function () {
            	myChart.resize();
                monthsChart.resize();
            }
        },200)
        $scope.$on("$destroy", function( event ) {
        	$interval.cancel(promise);
        	$interval.cancel(monthspromise);
		});
}]);