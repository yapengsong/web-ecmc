/**
 * Created by eayun on 2016/3/29.
 */
'use strict'

angular.module('eayun.warning')
    .controller('WarningRuleCtrl', ['$http', 'WarningService', 'eayunModal', 'toast','warningMsg', 'SysCode','loginInfo',
        function ($http, WarningService, eayunModal, toast, warningMsg,SysCode,loginInfo) {
        var vm = this;

        WarningService.getMonitorItemlist().then(function (response) {
            vm.monitorItemList = response.data;
        });

        vm.search = '';
        vm.options = {
            searchFn: function () {
                vm.ruleTable.api.draw();
            }
        };

        vm.query = {
            cpu: ''
        };

        vm.ruleTable = {
            source: '/api/ecmc/monitor/alarm/getecmcpagerulelist',
            api: {},
            getParams: function () {
                return {
                    name: vm.search,
                    monitorItem: vm.query.cpu ? vm.query.cpu : ''
                };
            }
        };

        vm.queryTable = function () {
            vm.ruleTable.api.draw();
        };

        vm.detail = function (_id) {
            WarningService.goRuleDetail(_id);
        };

        vm.add = function () {
            WarningService.addRule().then(function (rule) {
                $http.post('/api/ecmc/monitor/alarm/addecmcalarmrule', rule).then(function (response) {
                    if (response.data.respCode == SysCode.success) {
                        toast.success('创建报警规则' + /*+ (rule.name.length > 8 ? rule.name.substring(0, 7) + '...' : rule.name) + */'成功');
                        vm.ruleTable.api.draw();
                    }
                })
            });
        };

        vm.copy = function (_rule) {
            WarningService.copyRule(_rule).then(function (response) {
                if (response.respCode == SysCode.success) {
                    toast.success('复制报警规则成功');
                    vm.ruleTable.api.draw();
                }
            });
        };

        vm.delete = function (_rule) {
            eayunModal.confirm(_rule.alarmObjectNumber > 0 ? '该规则已关联报警对象，是否删除？' : '确定删除选定报警规则？').then(function () {
                WarningService.deleteRule(_rule.id,_rule.name).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        toast.success('删除报警规则成功');
                        vm.ruleTable.api.draw();
                        WarningService.getUnhandledAlarmMsgCount(warningMsg);
                    }
                });
            });
        };
    }]);