/**
 * Created by cl on 2016/6/21 0021.
 */


angular.module('eayun.center')
    .controller('historyCtrl', ['eayunModal', 'ServicetaskService', 'SysCode', '$stateParams', 'eayunStorage',
        function (eayunModal, ServicetaskService, SysCode, $stateParams, eayunStorage) {
            var vm = this;
            var history = this;

            var params = eayunStorage.persist("params");
            vm.triggerName = $stateParams.triggerName;
            vm.jobName = $stateParams.jobName;
            vm.model = {};
            vm.model.idd = $stateParams.taskid;

            //ServicetaskService.getTaskName($stateParams.taskid).then(function (data) {
            //    vm.taskName = data;
            //});

            var date = new Date();
            vm.beginTime = new Date(date.getTime() - 1 * 24 * 3600 * 1000);
            vm.endTime = date;
            vm.myTable = {
                source: '/api/ecmc/system/schedule/log/getloglist',
                api: {},
                getParams: function () {
                    console.log(vm.beginTime);
                    console.log(vm.endTime);
                    return {
                        triggerName: vm.triggerName,
                        jobName : vm.jobName,
                        startTime: vm.beginTime ? vm.beginTime.getTime() : null,
                        endTime: vm.endTime ? vm.endTime.getTime() : null,
                        queryStr: vm.queryStr,
                        isSuccess: vm.distribution
                    };
                }
            };


            history.doSearch = function () {
                vm.triggerName = null;
                vm.jobName = null;
                history.myTable.api.draw();
            };

            history.getResult = function(triggerCode){
                switch (triggerCode){
                    case "0":
                        return "失败";
                    case "1":
                        return "成功";
                    case "2":
                        return "哑火";
                    default:
                        return "";
                }

            }


        }]);

