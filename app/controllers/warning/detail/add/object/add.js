/**
 * Created by eayun on 2016/4/12.
 */
'use strict'

angular.module('eayun.warning')
    .controller('WarningRuleDetailObjectAddCtrl', ['$scope', 'ruleId','ruleName', 'monitorItem', 'WarningService', 'SysCode',
        function ($scope, ruleId,ruleName, monitorItem, WarningService, SysCode) {
        $scope.objParams = {};
        $scope.objListInRule = [];//
        $scope.objListOutRule = [];
        $scope.objRemoveList = [];

        $scope.objParams.cusId = '';
        $scope.objParams.ruleId = ruleId;
        $scope.objParams.monitorItem = monitorItem;

        /*获取客户列表*/
        WarningService.getAllCustomerList().then(function (data) {
            $scope.allCustomerList = data;
            $scope.objParams.cusId = data[0].cusId;
            $scope.getObjListByCusId();
        });
        /*获取已关联对象*/
        WarningService.getObjListInRule(ruleId).then(function (response) {
            $scope.objListInRule = response.data;
            $scope.selectedNumber = $scope.objListInRule.length;
        });

        /*切换客户*/
        $scope.getObjListByCusId = function () {
            WarningService.getProjectListByCusId($scope.objParams.cusId).then(function (data) {//获取项目列表
                $scope.projectList = data;
                if(data.length>0){
                    $scope.objParams.prjId = data[0].projectId;
                }else{
                    $scope.objParams.prjId='';
                }
                $scope.getObjListByPrjId();
            });
        };
        /*切换项目*/
        $scope.getObjListByPrjId = function () {
            WarningService.getObjListOutRule($scope.objParams).then(function (response) {
                if (response.respCode == SysCode.success) {
                    $scope.objListOutRule = angular.copy(response.data, []);
                    angular.forEach($scope.objListInRule, function (value1) {
                        angular.forEach($scope.objListOutRule, function (value2,index) {
                            if(value1.aoObjectId==value2.aoObjectId){
                                $scope.objListOutRule.splice(index,1);
                            }
                        });
                    });
                    var outMap = {};
                    angular.forEach($scope.objListOutRule,function(value){
                        outMap[value.aoObjectId] = value;
                    });
                    angular.forEach($scope.objRemoveList, function (value2) {
                        if($scope.objParams.prjId===value2.prjId && $scope.objParams.ruleId === value2.alarmRuleId && !outMap[value2.aoObjectId]){
                            $scope.objListOutRule.push(value2);
                        }
                    });
                }
            });
        };

        $scope.addObjToRule = function (_obj, _index) {
            $scope.objListInRule.push(_obj);
            $scope.objListOutRule.splice(_index, 1);
            $scope.selectedNumber = $scope.objListInRule.length;
            angular.forEach($scope.objRemoveList, function (value,index) {
                if(value.aoObjectId===_obj.aoObjectId && value.alarmRuleId===_obj.alarmRuleId){
                    $scope.objRemoveList.splice(index,1);
                }
            });
        };

        $scope.removeObjFromRule = function (_obj, _index) {
            $scope.objListInRule.splice(_index, 1);
            $scope.objRemoveList.push(_obj);
            $scope.getObjListByPrjId();
            $scope.selectedNumber = $scope.objListInRule.length;
        };

        $scope.commit = function () {
            var _params = {
                ruleId: ruleId,
                selectedAlarmObject: [],
                ruleName:ruleName
            };
            for (var i = 0; i < $scope.objListInRule.length; i++) {
                _params.selectedAlarmObject.push({
                    aoType: $scope.objListInRule[i].aoType,
                    aoObjectId: $scope.objListInRule[i].aoObjectId
                });
            }
            $scope.ok(_params);
        }
    }]);