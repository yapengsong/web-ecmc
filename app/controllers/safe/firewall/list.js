/**
 * Created by ZHL on 2016/4/7.
 */
'use strict';

angular.module('eayun.safe')
    .controller('SafeFirewallListCtrl', ['eayunModal', 'FwService','HomeCommonService','loginInfo', 'toast', 'SysCode','$scope','$timeout','$state',
                                         function (eayunModal, FwService,HomeCommonService,loginInfo, toast, SysCode,$scope,$timeout,$state) {
        var vm = this;

        FwService.getAllProjectList().then(function (response) {
            vm.allProjectList = response;
        });

        FwService.getDcResourceList().then(function (response) {
            vm.dcResourceList = response;
        });

        vm.search = '';
        vm.options = {
            searchFn: function () {
                vm.table.api.draw();
            },
            select: [{name: '名称'}, {cusOrg: '客户'}, {prjName: '项目'}],
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
            api: {},
            source: '/api/ecmc/virtual/cloudfirewall/list',
            getParams: function () {
                var param = {};
                param[vm.search.key] = vm.search.value;
                param['datacenterId'] = vm.datacenterId;
                param['projectId'] = vm.projectId
                return param;


            },
            result: []
        };

        var timer;
        vm.watchStatus = function(value){
            if(value!=='ACTIVE'){
            	timer = $timeout(vm.queryTable,5000);
            }
        };
        $scope.$on("$destroy", function( event ) {
        	$timeout.cancel( timer );
		});
        vm.queryTable = function () {
            vm.table.api.draw();
        };
        //刷新html状态
        vm.refresh = function () {
            var i, item;
            for (i = 0; i < vm.table.result.length; i++) {
                item = vm.table.result[i];
                if ((item.fwStatus == 'PENDING_UPDATE'
                    || item.fwStatus == 'PENDING_CREATE'
                    || item.fwStatus == 'PENDING_DELETE')) {
                    vm.queryTable();
                    break;
                }
            }
        };

        vm.fwStatusClass = [];

        vm.checkFwStatus = function (_fwModel, _index) {
            vm.fwStatusClass[_index] = '';
            if (_fwModel.fwStatus && _fwModel.fwStatus == 'ACTIVE') {
                return 'green';
            }
            else if (_fwModel.fwStatus == 'DOWN'|| _fwModel.fwStatus == 'ERROR') {
                return 'gray';
            }
            else if (_fwModel.fwStatus == 'PENDING_UPDATE' || _fwModel.fwStatus == 'PENDING_CREATE'|| _fwModel.fwStatus == 'PENDING_DELETE') {
                return 'yellow';
            }
            else {
                return 'yellow';
            }
        };


        vm.add = function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '创建防火墙',
                width: '650px',
                templateUrl: 'controllers/safe/firewall/add.html',
                controller: 'SafeFirewallListAddCtrl',
                controllerAs: 'fwAdd',
                resolve: {}
            });
            result.then(function (resultData) {
                FwService.addFirewall(resultData).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        var name=resultData.name.length > 9 ? resultData.name.substring(0, 8) + '...' : resultData.name;
                        toast.success('添加防火墙' + name + '成功');
                        vm.table.api.draw();
                    } else {
                        eayunModal.error(response.message);
                    }
                });
            });
        };

        vm.edit = function (_fwModel) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '编辑防火墙',
                width: '650px',
                templateUrl: 'controllers/safe/firewall/edit.html',
                controller: 'SafeFirewallListEditCtrl',
                controllerAs: 'fwEdit',
                resolve: {
                    fwModel: function () {
                        return _fwModel;
                    }
                }
            });
            result.then(function (resultData) {
                FwService.editFirewall(resultData).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        var name = resultData.name.length > 9 ? resultData.name.substring(0, 8) + '...' : resultData.name;
                        toast.success('修改防火墙' + name + '成功');
                        vm.table.api.draw();
                    } else {
                        eayunModal.error(response.message);
                    }
                });
            });
        };

        vm.delete = function (_fwModel) {
            eayunModal.confirm('删除后网络下的流量将不受限制,确定要删除防火墙' + _fwModel.fwName + '?').then(function () {
                FwService.deleteFirewall({
                    id: _fwModel.fwId,
                    projectId: _fwModel.prjId,
                    datacenterId: _fwModel.dcId,
                    fwpId:_fwModel.fwpId
                }).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        toast.success('删除防火墙成功');
                        vm.table.api.draw();
                    } else {
                        eayunModal.error(response.message);
                    }
                });
            });
        };

        vm.detail = function (_fwModel) {
            eayunModal.dialog({
                showBtn: false,
                title: '防火墙详情',
                width: '650px',
                templateUrl: 'controllers/safe/firewall/detail/detail.html',
                controller: 'SafeFirewallDetailCtrl',
                controllerAs: 'detail',
                resolve: {
                    fwModel: function () {
                        return _fwModel;
                    }
                }
            });
        };
        
    }]);