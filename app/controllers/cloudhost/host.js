/**
 * Created by eayun on 2016/3/21.
 */
'use strict';

angular.module('eayun.cloudhost')
    .controller('CloudhostHostCtrl', ['$state', '$timeout', 'HomeCommonService', 'WarningService', 'HostService', 'eayunModal', 'toast', '$scope', 'warningMsg',
        function ($state, $timeout, HomeCommonService, WarningService, HostService, eayunModal, toast, $scope, warningMsg) {
            var vm = this;

            vm.search = '';
            vm.options = {
                searchFn: function () {
                    vm.table.api.draw();
                },
                select: [{vmName: '名称'}, {cusOrg: '客户'}, {prjName: '项目'}, {ip: 'IP地址'}],
                series: {
                    cusOrg: {
                        multi: true,
                        data: function () {
                            return HomeCommonService.getAllCusOrgName();
                        }
                    },
                    prjName: {
                        multi: true,
                        data: function () {
                            return HomeCommonService.getAllPrjName();
                        }
                    }
                }
            };

            vm.table = {
                api: {},
                source: '/api/ecmc/cloud/vm/getvmpagelist',
                getParams: function () {
                    return {
                        dcId: vm.dcId,
                        vmStatus: vm.vmStatus,
                        sysType: vm.sysType,
                        timesort: vm.timesort,
                        queryType: vm.search.key,
                        queryName: vm.search.value
                    };
                },
                result: []
            };

            vm.queryTable = function () {
                vm.table.api.draw();
            };

            vm.refresh = function () {
                var i, item;
                for (i = 0; i < vm.table.result.length; i++) {
                    item = vm.table.result[i];
                    if ((item.vmStatus == 'BUILDING'
                        || item.vmStatus == 'SHUTOFFING'
                        || item.vmStatus == 'STARTING'
                        || item.vmStatus == 'REBOOT'
                        || item.vmStatus == 'DELETING'
                        || item.vmStatus == 'RESUMING'
                        || item.vmStatus == 'SOFT_DELETING'
                        || item.vmStatus == 'SOFT_RESUMING'
                        || item.vmStatus == 'SUSPENDEDING')) {
                        vm.table.api.refresh();
                        break;
                    }
                }
            };

            HomeCommonService.getDcList().then(function (data) {
                vm.dcList = data;
            });

            HostService.getAllVmSysList().then(function (data) {
                vm.allVmSysList = data;
            });

            vm.vmStatusClass = [];

            vm.checkVmStatus = function (_vmModel, _index) {
                vm.vmStatusClass[_index] = '';
                if(_vmModel.chargeState != '0'){
                    return 'gray';
                }
                else if (_vmModel.vmStatus && _vmModel.vmStatus == 'ACTIVE') {
                    return 'green';
                }
                else if (_vmModel.vmStatus == 'ERROR' || _vmModel.vmStatus == 'SUSPENDED') {
                    return 'red';
                }
                else if (_vmModel.vmStatus == 'SHUTOFF') {
                    return 'gray';
                }
                else {
                    return 'yellow';
                }
            };

            vm.create = function () {
                var open = eayunModal.open({
                    title: '创建云主机',
                    templateUrl: 'controllers/cloudhost/create.html',
                    controller: 'CloudhostHostCreateCtrl',
                    controllerAs: 'create',
                    resolve: {
                        prjId: function () {
                            return {};
                        }
                    }
                });
                open.result.then(function () {
                    vm.queryTable();
                    //refreshTable();
                });
            };
        }]);