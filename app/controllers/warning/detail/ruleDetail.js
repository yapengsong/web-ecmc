/**
 * Created by eayun on 2016/3/29.
 */
'use strict'

angular.module('eayun.warning')
    .controller('WarningRuleDetailCtrl', ['$stateParams', '$http', 'WarningService', 'eayunModal', 'toast', 'SysCode', 'warningMsg',
        function ($stateParams, $http, WarningService, eayunModal, toast, SysCode,warningMsg) {
        var vm = this;

        vm.alarmRule = {};

        WarningService.getRuleById($stateParams.alarmRuleId).then(function (response) {
            vm.alarmRule = response.data;
        });

        vm.objTable = {
            source: '/api/ecmc/monitor/alarm/getecmcobjpageinrule',
            api: {},
            getParams: function () {
                return {
                    ruleId: $stateParams.alarmRuleId
                };
            }
        };

        vm.addObject = function () {
            WarningService.addObject(vm.alarmRule.id, vm.alarmRule.monitorItem,vm.alarmRule.name).then(function (data) {
                WarningService.addObjToRule(data).then(function (response) {
                    if(response.respCode == SysCode.success){
                        toast.success('添加报警对象成功');
                        vm.objTable.api.draw();
                        WarningService.getUnhandledAlarmMsgCount(warningMsg);
                    }
                });
            });
        };

            vm.addAllObject = function () {     eayunModal.confirm('是否将平台内的所有云主机作为报警对象').then(function () {

                WarningService.addAllObject(vm.alarmRule.id,vm.alarmRule.name).then(function (response) {
                    if(response.respCode == SysCode.success){
                        //  if(response.message!=0){
                        toast.success('添加所有报警对象成功');
                        vm.objTable.api.draw();
                        WarningService.getUnhandledAlarmMsgCount(warningMsg);
                        //}else{
                        //    toast.success('添加成功！添加数量'+response.message);
                        //}

                    }

                });


            })

            };

        vm.removeObject = function (_obj) {
            eayunModal.confirm('确认删除报警对象？').then(function () {
                WarningService.removeObject(_obj.id,vm.alarmRule.id,vm.alarmRule.name).then(function (response) {
                    if(response.respCode == SysCode.success){
                        toast.success('删除报警对象成功');
                        vm.objTable.api.draw();
                        WarningService.getUnhandledAlarmMsgCount(warningMsg);
                    }
                });
            });
        };

        vm.contactTable = {
            source: '/api/ecmc/monitor/alarm/getecmcconsbyrule',
            api: {},
            getParams: function () {
                return {
                    ruleId: $stateParams.alarmRuleId
                };
            }
        };

        vm.addContact = function () {
            WarningService.addContact($stateParams.alarmRuleId,vm.alarmRule.name).then(function (data) {
                WarningService.addContactToRule(data).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        toast.success('添加报警联系人成功');
                        vm.contactTable.api.draw();
                    }
                });
            });
        };

        vm.removeContact = function (_alarmContact) {
            eayunModal.confirm('确认解绑报警联系人？').then(function(){
                WarningService.removeContact(_alarmContact.id,vm.alarmRule.id,vm.alarmRule.name).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        toast.success('解绑报警联系人成功');
                        vm.contactTable.api.draw();
                    }
                });
            });
        };
        vm.editAlarmRule= function (id) {
            WarningService.editRule(id).then(function (rule) {
                $http.post('/api/ecmc/monitor/alarm/updateecmcrule', rule).then(function (response) {
                    if (response.data.respCode == SysCode.success) {
                        toast.success('编辑报警规则' + /*+ (rule.name.length > 8 ? rule.name.substring(0, 7) + '...' : rule.name) + */'成功');
                        WarningService.getRuleById($stateParams.alarmRuleId).then(function (response) {
                            vm.alarmRule = response.data;
                        });
                    }
                })
            });
        }
    }]);