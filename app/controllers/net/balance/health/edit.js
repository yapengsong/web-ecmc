/**
 * Created by ZH.F on 2016/4/18.
 */

angular.module('eayun.net')
    .controller('HealthMonitorSaveCtrl', ['$scope', 'healthMonitor','HealthMonitorService', 'HomeCommonService', 'eayunModal',
        function ($scope, healthMonitor, HealthMonitorService, HomeCommonService, eayunModal) {
            var vm = this;
            vm.healthMonitor = healthMonitor;
            vm.dcList = {};
            vm.prjList = {};

            //----------默认值-----------
            if(vm.healthMonitor.ldmDelay == 'undefined'|| vm.healthMonitor.ldmDelay == undefined || vm.healthMonitor.ldmDelay == ''){
                vm.healthMonitor.ldmDelay = 15;
            }
            if(vm.healthMonitor.ldmTimeout == 'undefined' || vm.healthMonitor.ldmTimeout == undefined || vm.healthMonitor.ldmTimeout == ''){
                vm.healthMonitor.ldmTimeout = 10;
            }
            if(vm.healthMonitor.maxRetries == 'undefined' || vm.healthMonitor.maxRetries == undefined ||vm.healthMonitor.maxRetries == ''){
                vm.healthMonitor.maxRetries = 3;
            }

            vm.getProjectListByDcId = function(_dcId){
                HomeCommonService.getPrjByDcId(_dcId).then(function(response){
                    vm.prjList = response;
                    vm.healthMonitor.prjId ='';
                    vm.checkNameExist();
                });
            };

            HomeCommonService.getDcList().then(function (response) {
                vm.dcList = response;
            });

            vm.checkNameExist = function (){
                HealthMonitorService.checkNameExist(vm.healthMonitor).then(function(response){
                    vm.checkName = response.data.data;
                });
            };

            $scope.commit = function () {
                var promise;
                if (vm.healthMonitor.ldmId) {
                    promise = HealthMonitorService.editHealthMonitor(vm.healthMonitor);
                } else {
                    promise = HealthMonitorService.createHealthMonitor(vm.healthMonitor);
                }
                promise.then(function (data) {
                    $scope.ok(data);
                }, function (data) {
                });
            };

        }]);