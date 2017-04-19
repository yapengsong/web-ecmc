/**
 * Created by eayun on 2016/4/11.
 */
'use strict'

angular.module('eayun.warning')
    .controller('WarningRuleAddCtrl', ['$scope', 'WarningService', function ($scope, WarningService) {
        $scope.monitorItem='';
        $scope.alarmRuleModel = {};
        $scope.triggerModel = {};
        $scope.triggerArray = [];

        $scope.checkRuleName = function (_value) {
            return WarningService.checkRuleName($scope, _value);
        };

        WarningService.getMonitorItemlist().then(function (response) {
            $scope.monitorItemList=[];
            angular.forEach(response.data, function (value) {
                if(value.parentId=='0010003'){
                    $scope.monitorItemList.push(value);
                }
            })
        });

        $scope.getQuotaListByItem = function (_parentId) {
            WarningService.getQuotaListByItem(_parentId.nodeId).then(function (response) {
                $scope.monitorQuotaList = response.data;
                $scope.triggerArray = [];
            });
        };

        WarningService.getTriggerOperator().then(function (response) {
            $scope.triggerOperatorList = response.data;
        });

        WarningService.getTriggerTime().then(function (response) {
            $scope.triggerTimeList = response.data;
        });

        $scope.triggerModel = {};
        $scope.addAlarmTrigger = function () {
            var triggerModel = angular.copy($scope.triggerModel);
            $scope.triggerArray.push(triggerModel);
        };

        $scope.delAlarmTrigger = function (_index) {
            $scope.triggerArray.splice(_index, 1);
        };

        $scope.getQuotaUnit = function (_trigger,_quota) {
            _trigger.zb = _quota.nodeId;
            _trigger.unit = _quota.param1;
        };

        $scope.commit = function () {
            var _ecmcRuleModel = {
                name: $scope.alarmRuleModel.name,
                monitorItem: $scope.monitorItem.nodeId
            };
            var _triggerArray = $scope.triggerArray;
            $scope.ok({ecmcRuleModel: _ecmcRuleModel,triggerArray: _triggerArray});
        };
    }]);