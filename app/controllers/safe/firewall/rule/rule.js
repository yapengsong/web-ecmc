/**
 * Created by ZHL on 2016/4/7.
 */
'use strict';

angular.module('eayun.safe')
    .controller('SafeFirewallRuleCtrl', ['eayunModal', 'FwService','HomeCommonService','loginInfo', 'SysCode', 'toast','$stateParams','$state',
                                         function (eayunModal, FwService,HomeCommonService,loginInfo, SysCode, toast,$stateParams,$state) {
        var vm = this;
        vm.outModel = {};
        vm.search = '';
        FwService.getFwOne($stateParams.fwModel).then(function (response) {
            vm.outModel = response.data;
            vm.table.api.draw();
        });
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
            source: '/api/ecmc/virtual/cloudfwrule/list',
            getParams: function () {
               /* return {
                    name: vm.search,
                    projectId: vm.projectId,
                    datacenterId: vm.dcId
                };*/
                var param = {};
                param[vm.search.key] = vm.search.value;
                param['datacenterId'] = vm.dcId;
                param['fwpId'] = $stateParams.fwModel;
                return param;
            }
        };
        
        vm.queryTable = function () {
            vm.table.api.draw();
        };

        FwService.getAllProjectList().then(function (response) {
            vm.allProjectList = response;
        });

        FwService.getDcResourceList().then(function (response) {
            vm.dcResourceList = response;
        });


        vm.add = function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '添加规则',
                width: '650px',
                templateUrl: 'controllers/safe/firewall/rule/add/add.html',
                controller: 'SafeFirewallRuleAddCtrl',
                controllerAs: 'ruleAdd',
                resolve: {
                	dcId: function () {
                		return vm.outModel.dcId;
                	},
                	prjId: function () {
                		return vm.outModel.prjId;
                	}
                }
            });
            result.then(function (resultData) {
            	resultData.datacenterId = vm.outModel.dcId;
            	resultData.projectId = vm.outModel.prjId;
            	resultData.fwpId = vm.outModel.fwpId;
                FwService.addFirewallRule(resultData).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        var resultName=resultData.name.length>9?resultData.name.substring(0,9)+"...":resultData.name;
                        toast.success("添加规则"+resultName+"成功");
                        vm.table.api.draw();
                    } else {
                        eayunModal.error(response.message);
                    }
                });
            });
        };

        vm.edit = function (_rule) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '编辑规则',
                width: '650px',
                templateUrl: 'controllers/safe/firewall/rule/edit/edit.html',
                controller: 'SafeFirewallRuleEditCtrl',
                controllerAs: 'ruleEdit',
                resolve: {
                    ruleModel: function () {
                        return _rule;
                    }
                }
            });
            result.then(function (resultData) {
                FwService.editFirewallRule(resultData).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        toast.success('修改规则' + (resultData.name.length > 7 ? resultData.name.substring(0, 6) + '...' : resultData.name) + '成功');
                        vm.table.api.draw();
                    } else {
                        eayunModal.error(response.message);
                    }
                });
            });
        };

        vm.delete = function (_fwRule) {
            eayunModal.confirm('确定要删除规则' + _fwRule.fwrName + '?').then(function () {
                FwService.deleteFirewallRule({
                    datacenterId: _fwRule.dcId,
                    projectId: _fwRule.prjId,
                    id: _fwRule.fwrId,
                    fwpId:_fwRule.fwpId
                }).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        toast.success('删除规则成功');
                        vm.table.api.draw();
                    } else {
                        eayunModal.error(response.message);
                    }
                });
            });
        };

        vm.detail = function (_fwRule) {
            eayunModal.dialog({
                showBtn: false,
                title: '规则详情页',
                width: '650px',
                templateUrl: 'controllers/safe/firewall/rule/detail/detail.html',
                controller: 'SafeFirewallRuleDetailCtrl',
                controllerAs: 'ruleDetail',
                resolve: {
                    fwRule: function () {
                        return _fwRule;
                    }
                }
            });
        };
        
        vm.rulesequence = function (_fwRule) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '调整优先级',
                width: '650px',
                templateUrl: 'controllers/safe/firewall/rule/rulesq/rulesequence.html',
                controller: 'SafeFwRuleSequenceCtrl',
                controllerAs: 'rule',
                resolve: {
                	fwRule: function () {
                        return _fwRule;
                    },
                    fwpId:function () {
                    	return $stateParams.fwModel;
                    }
                }
            });
            result.then(function (resultData) {
                FwService.updateRuleSequence(resultData).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        toast.success('调整优先级成功');
                        vm.table.api.draw();
                    } else {
                        eayunModal.error(response.message);
                    }
                });
            });
        };
        
        vm.isEnabled = function (_fwRule,enabled){
        	var abled = "禁用";
        	if(enabled==1){abled = "启用";}
        	eayunModal.confirm('确定要'+abled+'规则' + _fwRule.fwrName + '?').then(function () {
	        	_fwRule.fwrEnabled=enabled;
	        	FwService.isEnabled(_fwRule).then(function (response){
	        		if (response.respCode == SysCode.success) {
	                    toast.success(response.data);
	                    vm.table.api.draw();
	                } else {
	                    eayunModal.error(response.message);
	                }
	        	});
        	});
        };
        
        vm.refreshVmInfo = function (_fwModel) {
        	$state.go('app.safe.tabs.firewall.rule',{fwModel:_fwModel});
        };
        /*将名称、描述变为可编辑状态*/
        vm.editNameOrDesc = function (type) {
            if (type == 'fwName') {
                vm.vmNameEditable = true;
                vm.vmDescEditable = false;
                vm.hintNameShow = true;
                vm.hintDescShow = false;
            }
            if (type == 'fwDesc') {
                vm.vmNameEditable = false;
                vm.vmDescEditable = true;
                vm.hintNameShow = false;
                vm.hintDescShow = true;
            }
            vm.vmEditModel = angular.copy(vm.outModel, {});
        };
        /*校验编辑名称是否存在*/
        vm.checkFwNameExist = function () {
        	vm.fwNameModel = angular.copy(vm.vmEditModel, {});
        	//vm.fwNameModel.fwId='';
            FwService.checkFireWallName(vm.fwNameModel).then(function (data) {
            	vm.checkVmNameFlag = data;
            });
        };
        /*保存编辑的名称、描述,并刷新界面*/
        vm.saveEdit = function (type) {
        	FwService.editFirewall(FwService.transferDataForCommit(vm.vmEditModel)).then(function (data) {
        		if (null != data && 'null' != data && data.code != "010120") {
					toast.success('修改防火墙'+ (vm.vmEditModel.fwName.length > 7 ? vm.vmEditModel.fwName.substring(0,6)+ '...' : vm.vmEditModel.fwName) + '成功',1000);
					if (type == 'fwName') {
	                    vm.vmNameEditable = false;
	                    vm.hintNameShow = false;
	                }
	                if (type == 'fwDesc') {
	                    vm.vmDescEditable = false;
	                    vm.hintDescShow = false;
	                }
	                vm.outModel = angular.copy(vm.vmEditModel, {});
				}
            });
        };
        /*取消名称、描述的可编辑状态*/
        vm.cancelEdit = function (type) {
            if (type == 'fwName') {
                vm.vmNameEditable = false;
                vm.hintNameShow = false;
            }
            if (type == 'fwDesc') {
                vm.vmDescEditable = false;
                vm.hintDescShow = false;
            }
        };
        
    }]);