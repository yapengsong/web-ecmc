/**
 * Created by cl on 2016/6/22 0022.
 */
angular.module('eayun.task')
    .controller('dataCrtl', ['eayunModal', 'ServicetaskService', 'SysCode', '$stateParams', 'CustomerService', function (eayunModal, ServicetaskService, SysCode, $stateParams, CustomerService) {
        var vm = this;
        vm.model = {};
        vm.model.Idd = $stateParams.taskid;

        ServicetaskService.getTaskName($stateParams.taskid).then(function(data){
            vm.taskName= data;
        });

        var date= new Date();
        vm.startTime=new Date(date.getTime()-6 * 24 * 3600 * 1000);
        vm.endTime=date;
        vm.myTable = {
            source: '/api/ecmc/system/schedule/statistics/getstatisticslist',
            api: {},
            getParams: function () {
                return {
                    taskId: $stateParams.taskid,
                    taskIdd: vm.taskid,
                    startTime: vm.startTime ? vm.startTime.getTime() : null,
                    endTime: vm.endTime ? vm.endTime.getTime() : null
                };
            }
        };

        vm.doSearch = function () {
            if(vm.checkTime()){
                vm.myTable.api.draw();
            }
        };

        vm.checkTime = function () {
            if (vm.endTime == null && vm.startTime == null) {
                eayunModal.error("请选择时间范围");
                return false;
            }
            if (vm.startTime == null) {
                eayunModal.error("请选择开始时间");
                return false;
            }
            if (vm.endTime == null) {
                eayunModal.error("请选择截止时间");
                return false;
            }
            var ms = vm.endTime.getTime() - vm.startTime.getTime();
            var days = ms / 1000 / 60 / 60 / 24;
            if (days >= 91) {
                eayunModal.error("时间范围不能大于90天");
                return false;
            }
            if (days <= 0) {
                eayunModal.error("开始时间必须小于截止时间");
                return false;
            }
            return true;
        }

        /**
         * 图表
         * */
        vm.chart = function (id) {
            if (vm.checkTime()) {
                ServicetaskService.getChartData(id, vm.startTime.getTime(), vm.endTime.getTime()).then(function (data) {
                    var result = eayunModal.dialog({
                        showBtn: false,
                        title: '图表',
                        width: '600px',
                        templateUrl: 'controllers/task/statistics/chart.html',
                        controller: 'chartCtrl',
                        controllerAs: 'taskChart',
                        resolve: {
                            statisticsModel: data
                        }
                    });
                });
            }
        };
    }]);

