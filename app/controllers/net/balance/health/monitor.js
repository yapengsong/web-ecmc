/**
 * Created by ZHL on 2016/4/7.
 */
'use strict';

angular.module('eayun.net')
    .controller('NetBalanceMonitorCtrl', ['HomeCommonService', 'HealthMonitorService', 'eayunModal','toast',
        function (HomeCommonService, HealthMonitorService, eayunModal, toast) {
        var vm = this;

        vm.dcList = {};
        HomeCommonService.getDcList().then(function (response) {
            vm.dcList = response;
        });

        vm.dcId = '';

        vm.search = '';
        vm.options = {
            searchFn: function () {
                vm.table.api.draw();
            },
            select: [{ldmName: '名称'}, {cusOrg: '客户'}, {prjName: '项目'}],
            series: {
                cusOrg: {
                    multi: true,
                    data: function(){
                        return HomeCommonService.getAllCusOrgName();
                    }
                },
                prjName: {
                    multi: true,
                    data: function(){
                        return HomeCommonService.getAllPrjName();
                    }
                }
            }
        };

        vm.table = {
            source: '/api/ecmc/virtual/loadbalance/healthmonitor/listmonitor',
            getParams: function () {
                var param = {};
                param[vm.search.key] = vm.search.value;
                param['dcId'] = vm.dcId;
                return param;
            },
            api: {},
            result: {}
        };

        vm.refreshTable = function(){
            vm.table.api.draw();
        };

        vm.showDetail = function (_healthMonitor) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '健康检查详情',
                width: '1080px',
                height: '300px',
                templateUrl: 'controllers/net/balance/health/detail.html',
                controller: 'HealthMonitorSaveCtrl',
                controllerAs: 'detail',
                resolve: {
                    healthMonitor:_healthMonitor
                }
            });
        };

        vm.createHealthMonitor = function () {
            var result = eayunModal.dialog({
                showBtn: true,
                title: '创建健康检查',
                width: '600px',
                height: '300px',
                templateUrl: 'controllers/net/balance/health/add.html',
                controller: 'HealthMonitorSaveCtrl',
                controllerAs: 'add',
                resolve: {
                    healthMonitor:{}
                }
            });
            result.then(function (_healthMonitor) {
                var name = _healthMonitor.ldmName.length>8?_healthMonitor.ldmName.substr(0,8)+"...":_healthMonitor.ldmName;
                var hint = "添加健康检查" + name + "成功";
                toast.success(hint);
                vm.table.api.draw();
            }, function () {
                vm.table.api.draw();
            });
        };

        vm.editHealthMonitor = function (_healthMonitor) {
            var result = eayunModal.dialog({
                showBtn: true,
                title: '编辑健康检查',
                width: '600px',
                height: '300px',
                templateUrl: 'controllers/net/balance/health/edit.html',
                controller: 'HealthMonitorSaveCtrl',
                controllerAs: 'edit',
                resolve: {
                    healthMonitor:_healthMonitor
                }
            });
            result.then(function (_hm) {
                var name = _hm.ldmName.length>8?_hm.ldmName.substr(0,8)+"...":_hm.ldmName;
                var hint = "编辑健康检查" + name + "成功";
                toast.success(hint);
                vm.table.api.draw();
            }, function () {
                vm.table.api.draw();
            });
        };

        vm.deleteHealthMonitor = function(_healthMonitor){
            var name = _healthMonitor.ldmName.length>9?_healthMonitor.ldmName.substr(0,9)+'...':_healthMonitor.ldmName;
            var page1 = eayunModal.open({
                templateUrl: 'controllers/net/deleteone.html',
                controller: 'DeleteResourceInfo1',
                controllerAs: 'delRes1',
                resolve: {
                    name: function () {
                        return _healthMonitor.ldmName;
                    }
                }
            }).result;
            page1.then(function () {
                var page2 = eayunModal.open({
                    templateUrl: 'controllers/net/deletetwo.html',
                    controller: 'DeleteResourceInfo2',
                    controllerAs: 'delRes2',
                    resolve: {
                        name: function () {
                            return _healthMonitor.ldmName;
                        }
                    }
                }).result;
                page2.then(function () {
                    HealthMonitorService.deleteHealthMonitor(_healthMonitor).then(function(){
                        toast.success('删除健康检查成功');
                        vm.table.api.draw();
                    });
                });
            });
            /*eayunModal.confirm("删除资源" + name + "有可能造成客户线上环境和财务损失，请确认与客户进行过沟通。").then(function () {
                eayunModal.confirm("资源" + name + "删除后将无法恢复，请谨慎操作。确认删除？").then(function () {
                    HealthMonitorService.deleteHealthMonitor(_healthMonitor).then(function(){
                        toast.success('删除健康检查成功');
                        vm.table.api.draw();
                    });
                });
            });*/
        };
    }]);