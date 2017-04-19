/**
 * Created by ZHL on 2016/4/7.
 */
'use strict';

angular.module('eayun.safe')
    .controller('SafeFirewallPolicyCtrl', ['FwService', 'HomeCommonService','loginInfo','eayunModal', 'SysCode', 'toast', function (FwService,HomeCommonService,loginInfo, eayunModal, SysCode, toast) {
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
            source: '/api/ecmc/virtual/cloudfwpoliy/querylist',
            getParams: function () {
                var param = {};
                param[vm.search.key] = vm.search.value;
                param['datacenterId'] = vm.datacenterId;
                return param;
            }
        };

        vm.queryTable = function () {
            vm.table.api.draw();
        };

        vm.add = function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '创建防火墙策略',
                width: '650px',
                templateUrl: 'controllers/safe/firewall/policy/add/add.html',
                controller: 'SafeFirewallPolicyAddCtrl',
                controllerAs: 'policyAdd',
                resolve: {}
            });
            result.then(function (resultDate) {
                FwService.addFirewallPolicy(resultDate).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        eayunModal.confirm('您刚刚创建了一个防火墙策略，是否现在为该策略绑定规则').then(function () {
                            var fwp = {};
                            fwp.prjId = response.data.tenant_id;
                            fwp.fwpId = response.data.id;
                            fwp.dcId = resultDate.datacenterId;
                            fwp.fwpName = resultDate.name;
                            vm.manage(fwp);
                        });
                        //toast.success('防火墙策略添加成功');
                        vm.table.api.draw();
                    } else {
                        eayunModal.error(response.message);
                    }
                });
            });
        };

        vm.edit = function (_policy) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '编辑防火墙策略',
                width: '650px',
                templateUrl: 'controllers/safe/firewall/policy/edit/edit.html',
                controller: 'SafeFirewallPolicyEditCtrl',
                controllerAs: 'policyEdit',
                resolve: {
                    policyModel: function () {
                        return _policy;
                    }
                }
            });
            result.then(function (resultDate) {
                FwService.editFirewallPolicy(resultDate).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        toast.success('修改策略' + (resultDate.name.length > 10 ? resultDate.name.substring(0, 9) + '...' : resultDate.name) + '成功');
                        vm.table.api.draw();
                    } else {
                        eayunModal.error(response.data);
                    }
                });
            });
        };

        vm.delete = function (_policy) {
            eayunModal.confirm('确定要删除策略' + _policy.fwpName + '?').then(function () {
                FwService.deleteFirewallPolicy({
                    fwpId: _policy.fwpId,
                    projectId: _policy.prjId,
                    datacenterId: _policy.dcId
                }).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        toast.success('删除策略' + (_policy.fwpName.length > 10 ? _policy.fwpName.substring(0, 9) + '...' : _policy.fwpName) + '成功');
                        vm.table.api.draw();
                    } else {
                        eayunModal.error(response.data);
                    }
                });
            });
        };

        vm.manage = function (_policy) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '管理规则',
                width: '600px',
                templateUrl: 'controllers/safe/firewall/policy/manage/manage.html',
                controller: 'SafeFirewallPolicyManageCtrl',
                controllerAs: 'manage',
                resolve: {
                    policyModel: function () {
                        return _policy;
                    }
                }
            });
            result.then(function (resultData) {
                FwService.manageRuleForFirePolicy(resultData).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        toast.success('策略' + (resultData.fwpName.length > 8 ? resultData.fwpName.substring(0, 7) + '...' : resultData.fwpName) + '修改规则成功');
                        vm.table.api.draw();
                    } else {
                        eayunModal.error(response.message);
                    }
                });
            })
        };

        vm.detail = function (_policy) {
            eayunModal.dialog({
                showBtn: false,
                title: '防火墙策略详情页',
                width: '650px',
                templateUrl: 'controllers/safe/firewall/policy/detail/detail.html',
                controller: 'SafeFirewallPolicyDetailCtrl',
                controllerAs: 'policyDetail',
                resolve: {
                    policyModel: function () {
                        return _policy;
                    }
                }
            });
        };
    }]);