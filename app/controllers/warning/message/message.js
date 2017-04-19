/**
 * Created by eayun on 2016/3/29.
 */
'use strict'

angular.module('eayun.warning')
    .controller('WarningMessageCtrl', ['WarningService','MonitorService', 'toast', 'SysCode', 'warningMsg','loginInfo', function (WarningService,MonitorService, toast, SysCode, warningMsg,loginInfo) {
        var vm = this;

        WarningService.getUnhandledAlarmMsgCount(warningMsg);
        vm.search = '';
        vm.options = {
            searchFn: function () {
                vm.messageTable.api.draw();
            },
            select: [{obj: '名称'}, {pro: '项目'}, {cus: '客户'},  {IP: 'IP'}],
            series: {
                cus: {
                    multi: true,
                    data: function () {
                        return MonitorService.getAllCustomerList().then(function (response) {
                            var array = [];
                            angular.forEach(response.data, function (value) {
                                array.push(value.cusOrg);
                            });
                            return array;
                        });
                    }
                },
                pro: {
                    multi: true,
                    data: function () {
                        return MonitorService.getAllProjectList().then(function (response) {
                            var array = [];
                            angular.forEach(response.data, function (value) {
                                array.push(value.prjName);
                            });
                            return array;
                        });
                    }
                },
                IP: {
                    multi: true
                }
            },
            checkbox: true
        };

        vm.isAllChecked = false;
        var checkedIds = [];

        vm.messageTable = {
            source: '/api/ecmc/monitor/alarm/getecmcpagemsglist',
            api: {},
            getParams: function () {
                return {
                    amType: vm.query.item ? vm.query.item : '',
                    dcName: vm.query.dcName != '' ? vm.query.dcName : '',
                    isProcessed: vm.query.isProcessed != '' ? vm.query.isProcessed : '',
                    queryType: vm.search.key ? vm.search.key : '',
                    queryName: vm.search.value ? vm.search.value : ''
                };
            }
        };

        vm.query = {
            type: '',
            dcName: '',
            project: '',
            isProcessed: ''
        };
        vm.itemList = {};
        vm.dcResourceList = {};
        vm.allProjectList = {};

        vm.queryTable = function () {
            vm.messageTable.api.draw();
        };

        WarningService.getItemList().then(function (response) {
            vm.itemList = response.data.data;
        });

        WarningService.getDcResourceList().then(function (response) {
            vm.dcResourceList = response.data;
            vm.dcResourceList.push({
                "apiDcCode":"----",
                "name":"----"
            }) ;
        });

        WarningService.getAllProjectList().then(function (response) {
            vm.allProjectList = response.data;
        });

        vm.updateSelection = function ($event, id) {
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            updateSelected(action, id);
        };
        var updateSelected = function (action, id) {
            if (action == 'add' && checkedIds.indexOf(id) == -1) {
                checkedIds.push(id);
            }
            if (action == 'remove' && checkedIds.indexOf(id) != -1) {
                var index = checkedIds.indexOf(id);
                checkedIds.splice(index, 1);
            }
        };

        vm.checkAll = function () {
            if (vm.isAllChecked) {
                angular.forEach(vm.messageTable.result, function (value) {
                    if (value.isProcessed != '1') {
                        value.isChecked = vm.isAllChecked;
                        checkedIds.push(value.id);
                    }
                });
            } else {
                checkedIds.splice(0, checkedIds.length);
                angular.forEach(vm.messageTable.result, function (value) {
                    if (value.isProcessed != '1') {
                        value.isChecked = vm.isAllChecked;
                    }
                });
            }
        };

        vm.eraseWarningMsg = function () {
            if (checkedIds.length > 0) {
                WarningService.eraseWarningMsg(checkedIds).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        toast.success("消除报警信息成功");
                        vm.messageTable.api.draw();
                        checkedIds.splice(0, checkedIds.length);
                        WarningService.getUnhandledAlarmMsgCount(warningMsg);
                    }
                });
            } else {
                toast.error('请选择至少一条报警信息');
            }
        };

        vm.exportMsgExcel = function () {
            WarningService.exportMsgExcel();
        };

    }]).filter("printContent",function(){
        return function (input){
            if (input == "null" || input == null) {
                return "----";
            }else{
                return input ;
            }
        }
    });