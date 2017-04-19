/**
 * Created by eayun on 2016/4/11.
 */
'use strict'

angular.module('eayun.warning')
    .controller('WarningRuleEditCtrl', ['$scope', 'ruleId', 'WarningService', function ($scope, ruleId, WarningService) {
        $scope.alarmRuleModel = {};
        $scope.trigger={
            quota:''
        };
        WarningService.getRuleForEdit(ruleId).then(function (data) {
            $scope.alarmRuleModel = data.alarmRuleModel;
            $scope.triggerArray=data.triggerArray;
            WarningService.getMonitorItemlist().then(function (response) {
                $scope.monitorItemList=[];
                angular.forEach(response.data, function (value) {
                    if(value.parentId=='0010003'){
                        $scope.monitorItemList.push(value);
                    }
                })
            });
            $scope.monitorItem=$scope.alarmRuleModel.monitorItem;
            $scope.getQuotaListByItem($scope.monitorItem);
            //$scope.trigger.quota=data.triggerArray[0].zb;
        });
        //$scope.checkRuleName = function (_value) {
        //    return WarningService.checkRuleName($scope, _value);
        //};
        $scope.getQuotaListByItem = function (_parentId) {
            WarningService.getQuotaListByItem(_parentId).then(function (response) {
                $scope.monitorQuotaList = response.data;
            });
        };
        WarningService.getTriggerOperator().then(function (response) {
            $scope.triggerOperatorList = response.data;
        });

        WarningService.getTriggerTime().then(function (response) {
            $scope.triggerTimeList = response.data;
        });
        //
        $scope.triggerModel = {};
        $scope.addAlarmTrigger = function () {
            var triggerModel = angular.copy($scope.triggerModel);
            $scope.triggerArray.push(triggerModel);
        };

        $scope.delAlarmTrigger = function (_index) {
            $scope.triggerArray.splice(_index, 1);
        };

        $scope.getQuotaUnit = function (_trigger,_quota) {
           angular.forEach($scope.monitorQuotaList, function (data) {
               if(data.nodeId==_quota){
                   _trigger.zb = data.nodeId;
                   _trigger.unit= data.param1;
               }
           });
        };

        $scope.commit = function () {
            var _ecmcRuleModel = {
                name: $scope.alarmRuleModel.name,
                monitorItem: $scope.monitorItem,
                id:ruleId
            };
            var _triggerArray = $scope.triggerArray;
            $scope.ok({ecmcRuleModel: _ecmcRuleModel,triggerArray: _triggerArray});
        };
    }]);