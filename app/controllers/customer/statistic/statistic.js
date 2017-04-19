/**
 * Created by eayun on 2016/3/25.
 */
'use strict'

angular.module('eayun.customer')
    .controller('CustomerStatisticCtrl',['CustomerService','$stateParams','eayunModal','toast', function (CustomerService,$stateParams,eayunModal,toast) {
        var vm = this;

        vm.showTab = 'cloud';

        vm.isShow = true;

        vm.setShowTab = function (str) {
            vm.showTab = str;
        };

        vm.showCon = false;
        /*初始化没有排序*/
        vm.initialize  = function () {
            vm.resourceType = '';
            vm.sort='';
            vm.sortClass = 'glyphicon glyphicon-sort';
            vm.sortCpuClass = 'glyphicon glyphicon-sort';
            vm.sortRamClass = 'glyphicon glyphicon-sort';
            vm.sortStartClass = 'glyphicon glyphicon-sort';
            vm.sortHoursClass = 'glyphicon glyphicon-sort';
        };
        vm.initialize();
        vm.initializeVol  = function () {
            vm.volType = '';
            vm.volSort='';
            vm.volSortClass = 'glyphicon glyphicon-sort';
            vm.sortVolStartClass = 'glyphicon glyphicon-sort';
            vm.sortVolHoursClass = 'glyphicon glyphicon-sort';
            vm.sortVolSizeClass = 'glyphicon glyphicon-sort';
        };
        vm.initializeVol();

        vm.doShow = function(model){
            model.isShow = !model.isShow;
        };
        CustomerService.getPrjByPrjId($stateParams.prjId).then(function(data){
            vm.prjName = data.data.prjName;
        });

        var date= new Date();
        vm.startTime=new Date(date.getTime()-7 * 24 * 3600 * 1000);
        vm.endTime=date;
        vm.queryList=function (){
            if(checkTime()){
                vm.initialize();
                vm.initializeVol();
                if(!vm.showCon){
                    vm.vmTable = {
                        source: '/api/ecmc/project/getvmresource',
                        api:{},
                        getParams: function () {
                            return {
                                cusId :$stateParams.cusId,
                                dcId : $stateParams.dcId,
                                startTime : vm.startTime.getTime(),
                                endTime : vm.endTime.getTime(),
                                orderBy : vm.resourceType,
                                sort : vm.sort
                            };
                        }
                    };
                    vm.volTable = {
                        source: '/api/ecmc/project/getvolumeresource',
                        api:{},
                        getParams: function () {
                            return {
                                cusId :$stateParams.cusId,
                                dcId : $stateParams.dcId,
                                startTime : vm.startTime.getTime(),
                                endTime : vm.endTime.getTime(),
                                orderBy : vm.volType,
                                sort : vm.volSort
                            };
                        }
                    };
                }else{
                    vm.vmTable.api.draw();
                    vm.volTable.api.draw();
                }
                var param = {
                    projectId : $stateParams.prjId,
                    startTime : vm.startTime.getTime(),
                    endTime : vm.endTime.getTime()
                };
                CustomerService.getNetResource(param).then(function(response){
                    vm.netRes = response.data;
                });
                vm.showCon = true;
            }
        };
        function checkTime(){
            if(vm.endTime==null&&vm.startTime==null){
                eayunModal.error("请选择时间范围");
                return false;
            }
            if(vm.startTime==null){
                eayunModal.error("请选择开始时间");
                return false;
            }
            if(vm.endTime==null){
                eayunModal.error("请选择截止时间");
                return false;
            }
            var ms =vm.endTime.getTime()-vm.startTime.getTime();
            var days = ms/1000/60/60/24;
            if(days >= 91){
                eayunModal.error("时间范围不能大于90天");
                return false;
            }
            if(days <= 0){
                eayunModal.error("开始时间必须小于截止时间");
                return false;
            }
            return true;
        }

        /*排序*/
        vm.changeVmSort = function (_resourceType) {
            if(vm.resourceType!=_resourceType){
                vm.initialize();
            }
            vm.resourceType = _resourceType;
            switch (vm.sort) {
                case ''     :
                    vm.sort = 'DESC';
                    vm.sortClass = 'glyphicon glyphicon-arrow-down';
                    break;
                case 'DESC' :
                    vm.sort = 'ASC';
                    vm.sortClass = 'glyphicon glyphicon-arrow-up';
                    break;
                case 'ASC'  :
                    vm.sort = 'DESC';
                    vm.sortClass = 'glyphicon glyphicon-arrow-down';
                    break;
            };
            switch (_resourceType) {
                case 'CPU'     :
                    vm.sortCpuClass = vm.sortClass;
                    break;
                case 'RAM' :
                    vm.sortRamClass = vm.sortClass;
                    break;
                case 'START'  :
                    vm.sortStartClass = vm.sortClass;
                    break;
                case 'HOURS'     :
                    vm.sortHoursClass = vm.sortClass;
                    break;
            };
            vm.vmTable.api.draw();
        };
        vm.changeVolSort = function (_volType) {
            if(vm.volType!=_volType){
                vm.initializeVol();
            }
            vm.volType = _volType;
            switch (vm.volSort) {
                case ''     :
                    vm.volSort = 'DESC';
                    vm.volSortClass = 'glyphicon glyphicon-arrow-down';
                    break;
                case 'DESC' :
                    vm.volSort = 'ASC';
                    vm.volSortClass = 'glyphicon glyphicon-arrow-up';
                    break;
                case 'ASC'  :
                    vm.volSort = 'DESC';
                    vm.volSortClass = 'glyphicon glyphicon-arrow-down';
                    break;
            };
            switch (_volType) {
                case 'VOL'     :
                    vm.sortVolSizeClass = vm.volSortClass;
                    break;
                case 'START'  :
                    vm.sortVolStartClass = vm.volSortClass;
                    break;
                case 'HOURS'     :
                    vm.sortVolHoursClass = vm.volSortClass;
                    break;
            };
            vm.volTable.api.draw();
        };

        vm.createExcel = function(){
            checkTime();
            var explorer =navigator.userAgent;
            var browser = 'ie';
            if (explorer.indexOf("MSIE") >= 0) {
                browser="ie";
            }else if (explorer.indexOf("Firefox") >= 0) {
                browser = "Firefox";
            }else if(explorer.indexOf("Chrome") >= 0){
                browser="Chrome";
            }else if(explorer.indexOf("Opera") >= 0){
                browser="Opera";
            }else if(explorer.indexOf("Safari") >= 0){
                browser="Safari";
            }else if(explorer.indexOf("Netscape")>= 0) {
                browser='Netscape';
            }
            var paramExcel = {
                dcId : $stateParams.dcId,
                projectId : $stateParams.prjId,
                startTime : vm.startTime.getTime(),
                endTime : vm.endTime.getTime(),
                browser:browser
            };
            CustomerService.getResourcesForExcel(paramExcel).then(function(response){
                if(response){
                    $("#excel-export-iframe").attr("src", "/api/ecmc/project/createexcel.do?projectId="+$stateParams.prjId+"&dcId="+$stateParams.dcId+"&cusId="+$stateParams.cusId
                        +"&startTime="+vm.startTime.getTime()+"&endTime="+vm.endTime.getTime()+"&browser="+browser
                        +"&orderBy="+vm.resourceType+"&sort="+vm.sort+"&orderByVol="+vm.volType+"&sortVol="+vm.volSort);
                }else{
                    toast.success("当前条件范围无数据");
                }
            });
        };
        /**
         * 显示柱状图
         */
        vm.showHistogram = function(){
            var result = eayunModal.dialog({
                showBtn: false,
                title: '柱状图',
                width: '1000px',
                templateUrl: 'controllers/customer/statistic/gram/gram.html',
                controller: 'GramCtrl',
                controllerAs:'gram',
                resolve: {
                    hismodel: function () {
                        return  angular.copy(vm.netRes,{});
                    }
                }
            });
        };
    }]);