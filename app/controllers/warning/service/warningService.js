/**
 * Created by eayun on 2016/4/5.
 */
'use strict'

angular.module('eayun.warning')
    .service('WarningService', ['$http', '$state', 'eayunModal', '$q', 'SysCode', function ($http, $state, eayunModal, $q, SysCode) {
        var warningService = {};

        warningService.goRuleDetail = function (_id) {
            $state.go('app.warning.detail', {alarmRuleId: _id});
        };

        warningService.getItemList = function () {
            return $http.post('/api/ecmc/monitor/alarm/getecmcitemlist');
        };

        warningService.getDcResourceList = function () {
            return $http.post('/api/ecmc/overview/getalldclist');
        };

        warningService.getAllProjectList = function () {
            return $http.post('/api/ecmc/overview/getallprojectlist');
        };

        warningService.eraseWarningMsg = function (_checkedIds) {
            return $http.post('/api/ecmc/monitor/alarm/eraseecmcmsgbyids', {checkedIds: _checkedIds}).then(function (response) {
                return response.data;
            });
        };

        warningService.exportMsgExcel = function () {
            var explorer = navigator.userAgent;
            var browser = 'ie';
            if (explorer.indexOf("MSIE") >= 0) {
                browser = "ie";
            } else if (explorer.indexOf("Firefox") >= 0) {
                browser = "Firefox";
            } else if (explorer.indexOf("Chrome") >= 0) {
                browser = "Chrome";
            } else if (explorer.indexOf("Opera") >= 0) {
                browser = "Opera";
            } else if (explorer.indexOf("Safari") >= 0) {
                browser = "Safari";
            } else if (explorer.indexOf("Netscape") >= 0) {
                browser = 'Netscape';
            }
            $("#file-export-iframe").attr("src", "/api/ecmc/monitor/alarm/exportmsgexcel.do?browser=" + browser);
        };

        warningService.checkRuleName = function (_obj, _value) {
            _obj.nameFlag = false;
            var inputFormat = /^[\u4e00-\u9fa5a-zA-Z0-9]([\u4e00-\u9fa5_a-zA-Z0-9\s]{0,18}[\u4e00-\u9fa5a-zA-Z0-9]){0,1}$/;
            if (inputFormat.test(_value)) {
                return true;
            } else {
                _obj.nameFlag = true;
            }
        };

        warningService.getMonitorItemlist = function () {
            return $http.post('/api/ecmc/monitor/alarm/getecmcitemlist').then(function (response) {
                return response.data;
            });
        };

        warningService.getQuotaListByItem = function (_parentId) {
            return $http.post('/api/ecmc/monitor/alarm/getzblistbyitem', {parentId: _parentId}).then(function (response) {
                return response.data;
            });
        };

        warningService.getTriggerOperator = function () {
            return $http.post('/api/ecmc/monitor/alarm/getecmctriggeroperator').then(function (response) {
                return response.data;
            })
        };

        warningService.getTriggerTime = function () {
            return $http.post('/api/ecmc/monitor/alarm/getecmctriggertimes').then(function (response) {
                return response.data;
            });
        };

        warningService.addRule = function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '创建报警规则',
                width: '800px',
                templateUrl: 'controllers/warning/rule/add/add.html',
                controller: 'WarningRuleAddCtrl',
                resolve: {}
            });
            return result;
        };

        warningService.editRule = function (_ruleId) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '编辑报警规则',
                width: '800px',
                templateUrl: 'controllers/warning/rule/edit/edit.html',
                controller: 'WarningRuleEditCtrl',
                resolve: {
                    ruleId: function () {
                        return _ruleId;
                    }
                }
            });
            return result;
        };

        warningService.getRuleForEdit = function (_ruleId) {
            return $http.post('/api/ecmc/monitor/alarm/getjsonforecmcruleparams', {ruleId: _ruleId}).then(function (response) {
                return response.data;
            });
        };

        warningService.copyRule = function (_rule) {
            return $http.post('/api/ecmc/monitor/alarm/copyecmcalarmrule', _rule).then(function (response) {
                return response.data;
            });
        };

        warningService.deleteRule = function (_id,ruleName) {
            return $http.post('/api/ecmc/monitor/alarm/deleteecmcalarmrule', {
                ruleId: _id,ruleName:ruleName
            }).then(function (response) {
                return response.data;
            });
        };

        warningService.getRuleById = function (_id) {
            return $http.post('/api/ecmc/monitor/alarm/getecmcrulebyid', {alarmRuleId: _id}).then(function (response) {
                return response.data;
            });
        };

        warningService.addObject = function (_ruleId, _monitroItem,_ruleName) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '添加报警对象',
                width: '800px',
                templateUrl: 'controllers/warning/detail/add/object/add.html',
                controller: 'WarningRuleDetailObjectAddCtrl',
                resolve: {
                    ruleId: function () {
                        return _ruleId;
                    },
                    monitorItem: function () {
                        return _monitroItem;
                    },
                    ruleName: function () {
                        return _ruleName;
                    }
                }
            });
            return result;
        };

        warningService.removeObject = function (_id,ruleId,ruleName) {
            return $http.post('/api/ecmc/monitor/alarm/removeecmcobjfromrule', {id: _id,ruleId:ruleId,ruleName:ruleName}).then(function (response) {
                return response.data;
            });
        };

        warningService.getAllCustomerList = function () {
            return $http.post('/api/ecmc/customer/getallcustomerorg').then(function (response) {
                return response.data.data;
            });
        };

        warningService.getProjectListByCusId = function (_cusId) {
            return $http.post('/api/ecmc/project/getprojectbycustomer', {cusId: _cusId}).then(function (response) {
                return response.data.data;
            });
        };

        warningService.getObjListInRule = function (_ruleId) {
            return $http.post('/api/ecmc/monitor/alarm/getecmcobjlistinrule', {ruleId: _ruleId}).then(function (response) {
                return response.data;
            });
        };

        warningService.getObjListOutRule = function (_params) {
            return $http.post('/api/ecmc/monitor/alarm/getecmcobjlistoutrule', _params).then(function (response) {
                return response.data;
            });
        };

        warningService.addObjToRule = function (_params) {
            return $http.post('/api/ecmc/monitor/alarm/addecmcobjtorule', _params).then(function (response) {
                return response.data;
            });
        };

        warningService.addAllObject = function (id,name) {

            return $http.post('/api/ecmc/monitor/alarm/addAllecmcobjtorule',{ ruleName:name,ruleId:id}).then(function (response) {
                return response.data;
            });
        };

        warningService.addContact = function (_ruleId,ruleName) {
            var result = eayunModal.dialog({
                showBtn: true,
                title: '添加报警联系人',
                width: '640px',
                templateUrl: 'controllers/warning/detail/add/contact/add.html',
                controller: 'WarningRuleDetailContactAddCtrl',
                resolve: {
                    ruleId: function () {
                        return _ruleId;
                    },
                    ruleName: function () {
                        return ruleName;
                    }
                }
            });
            return result;
        };

        warningService.removeContact = function (_id,ruleId,ruleName) {
            return $http.post('/api/ecmc/monitor/alarm/removeecmcconfromrule', {alarmContactId: _id,ruleId:ruleId,ruleName:ruleName}).then(function (response) {
                return response.data;
            });
        };

        warningService.getAllContactList = function () {
            var deferred = $q.defer();
            $http.post('/api/ecmc/monitor/alarm/getallalarmcontacts', {}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };

        warningService.getAllContactGroupBy = function () {
            var deferred = $q.defer();
            $http.post('/api/ecmc/monitor/alarm/getallconsgroupby', {}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };

        warningService.getSelectedContact = function (_ruleId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/monitor/alarm/getecmcconsbyrule', {ruleId: _ruleId}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };

        warningService.getUnselectedContact = function (_ruleId) {
            return $http.post('/api/ecmc/monitor/alarm/getecmcobjlistoutrule', {ruleId: _ruleId}).then(function (response) {
                return response.data;
            });
        };

        warningService.addContactToRule = function (_params) {
            return $http.post('/api/ecmc/monitor/alarm/addecmcconstorule', _params).then(function (response) {
                return response.data;
            });
        };

        warningService.getUnhandledAlarmMsgCount = function (_obj) {
            $http.post('/api/ecmc/monitor/alarm/getecmcunmsgcount',{}).then(function (response) {
                _obj.unhandledAlarmMsgCount = response.data.count;
            });
        };

        warningService.containsItemInContact = function (array, item) {
            var i = array.length;
            while (i--) {
                if (array[i].contactName === item.contactName) {
                    return true;
                }
            }
            return false;
        };

        return {
            goRuleDetail: warningService.goRuleDetail,
            getItemList: warningService.getItemList,
            getDcResourceList: warningService.getDcResourceList,
            getAllProjectList: warningService.getAllProjectList,
            eraseWarningMsg: warningService.eraseWarningMsg,
            exportMsgExcel: warningService.exportMsgExcel,
            checkRuleName: warningService.checkRuleName,
            getMonitorItemlist: warningService.getMonitorItemlist,
            getQuotaListByItem: warningService.getQuotaListByItem,
            getTriggerOperator: warningService.getTriggerOperator,
            getTriggerTime: warningService.getTriggerTime,
            addRule: warningService.addRule,
            editRule: warningService.editRule,
            getRuleForEdit: warningService.getRuleForEdit,
            copyRule: warningService.copyRule,
            deleteRule: warningService.deleteRule,
            getRuleById: warningService.getRuleById,
            addObject: warningService.addObject,
            removeObject: warningService.removeObject,
            getAllCustomerList: warningService.getAllCustomerList,
            getProjectListByCusId: warningService.getProjectListByCusId,
            getObjListInRule: warningService.getObjListInRule,
            getObjListOutRule: warningService.getObjListOutRule,
            addObjToRule: warningService.addObjToRule,
            addContact: warningService.addContact,
            removeContact: warningService.removeContact,
            getAllContactList: warningService.getAllContactList,
            getAllContactGroupBy: warningService.getAllContactGroupBy,
            getSelectedContact: warningService.getSelectedContact,
            getUnselectedContact: warningService.getUnselectedContact,
            addContactToRule: warningService.addContactToRule,
            getUnhandledAlarmMsgCount: warningService.getUnhandledAlarmMsgCount,
            containsItemInContact: warningService.containsItemInContact,
            addAllObject:warningService.addAllObject
        };
    }])
    .factory('warningMsg', [function () {
        var warningMsg = {
            unhandledAlarmMsgCount: 0
        };
        return warningMsg;
    }]);