/**
 * Created by ZHL on 2016/4/7.
 */
'use strict';

angular.module('eayun.safe')
    .controller('SafeGroupDetailCtrl', ['SafeGroupService','loginInfo', '$stateParams', 'eayunModal', 'toast','SysCode','$state',
        function (SafeGroupService,loginInfo, $stateParams, eayunModal, toast,SysCode,$state) {
        var vm = this;

        vm.safeGroup = {};
        vm.safeGroup.cusOrg =  $stateParams.cusOrg;

        SafeGroupService.getSafeGroupById($stateParams.safeGroupId).then(function (response) {
            vm.safeGroup = response.data;
        });

        vm.sgRuleTable = {
            source: '/api/ecmc/virtual/securitygroup/getrulesbysgid',

            getParams: function () {
                return {
                    dcId: '',
                    prjId: '',
                    sgId: $stateParams.safeGroupId
                };
            },
            api: {},
            result: {}
        };
            vm.sgcloudhostTable = {
                source: '/api/ecmc/virtual/securitygrouprule/queryCloudHostList',
                getParams: function () {
                    return {

                        sgId: $stateParams.safeGroupId
                    };
                },
                api: {},
                result: {}
            };

        vm.createRule = function(_sg){
            var result = eayunModal.dialog({
                showBtn: false,
                title: '添加规则',
                width: '1000px',
               // height: '1000px',
                templateUrl: 'controllers/safe/group/addRule.html',
                controller: 'SafeGroupRuleCtrl',
                controllerAs: 'add',
                resolve: {
                    safeGroup: _sg
                }
            });
            result.then(function (_sg) {
                toast.success('添加规则成功');
                vm.sgRuleTable.api.draw();
            }, function () {

            });
        };

        vm.deleteGroupRule = function (_sgRule) {
        	var title = _sgRule.direction=='egress'?'出方向':'入方向';
        	var xieyi = _sgRule.protocol==''? '所有':_sgRule.protocol;
        	var duankou = (_sgRule.portRangeMin==_sgRule.portRangeMax?_sgRule.protocolExpand:_sgRule.portRangeMin+'-'+_sgRule.portRangeMax)==''?'-':(_sgRule.portRangeMin==_sgRule.portRangeMax?_sgRule.protocolExpand:_sgRule.portRangeMin+'-'+_sgRule.portRangeMax);
            if(duankou=='-'){
                duankou='--';
            }
        	var icmp = _sgRule.icMp;
            if(icmp==''){
                icmp='--'
            }
        	var yuan = _sgRule.remoteIpPrefix!=''&& null!=_sgRule.remoteIpPrefix ? _sgRule.remoteIpPrefix + "(CIDR)": _sgRule.remoteGroupName!=''?_sgRule.remoteGroupName :'0.0.0.0/0 (CIDR)';
            eayunModal.confirm("确定要删除规则'"+title+"'/'"+xieyi+"'/'"+duankou+"'/'"+icmp+"'/'"+yuan+"'?").then(function () {
                SafeGroupService.deleteGroupRule(_sgRule).then(function(){
                    toast.success('删除规则成功');
                    vm.sgRuleTable.api.draw();
                });
            });
        };

            vm.deleteGroupcloudhost = function (sgId,vmid,prjid,dcid,sgname,vmname) {
                eayunModal.confirm('确定要移除云主机吗?').then(function () {

                    SafeGroupService.deletedcloudhos(sgId,vmid,prjid,dcid,sgname,vmname).then(function(data) {
                        if (data.respCode == SysCode.success) {
                        toast.success('移除成功');
                         vm.sgcloudhostTable.api.draw();}

                    });
                });
            };


//            vm.fwStatusClass = [];
//
//            vm.checkFwStatus = function (_fwModel, _index) {
//                vm.fwStatusClass[_index] = '';
//                if (_fwModel.vm_status && _fwModel.vm_status == 'ACTIVE') {
//                    return 'green';
//                }
//                else if (_fwModel.vm_status == 'DOWN'|| _fwModel.vm_status == 'ERROR') {
//                    return 'gray';
//                }
//                else if (_fwModel.vm_status == 'PENDING_UPDATE' || _fwModel.vm_status == 'PENDING_CREATE'|| _fwModel.vm_status == 'PENDING_DELETE') {
//                    return 'yellow';
//                }
//                else {
//                    return 'yellow';
//                }
//                if (_fwModel.vm_status && _fwModel.vm_status == 'ACTIVE') {
//					return 'green';
//				} else if (_fwModel.vm_status == 'SHUTOFF' ) {
//					return 'gray';
//				} else if (_fwModel.vm_status == 'SUSPENDED'||_fwModel.vm_status=='SOFT_DELETED'||_fwModel.vm_status == 'ERROR') {
//					return 'red';
//				} else {
//					return 'yellow';
//				}
//
//
//
//
//
//            };

            vm.vmStatusClass = [];

            vm.checkVmStatus = function (_vmModel, _index) {
                vm.vmStatusClass[_index] = '';
                if(_vmModel.cheang_st=='1'||_vmModel.cheang_st=='2'||_vmModel.cheang_st=='3')
                {
                    return 'gray';
                }
                if (_vmModel.vm_status && _vmModel.vm_status == 'ACTIVE') {
                    return 'green';
                } else if (_vmModel.vm_status == 'SHUTOFF' ) {
                    return 'gray';
                } else if (_vmModel.vm_status == 'SUSPENDED'||_vmModel.vm_status=='SOFT_DELETED'||_vmModel.vm_status == 'ERROR') {
                    return 'red';
                } else {
                    return 'yellow';
                }
            };

            vm.manage = function (sgid,prjid,sgname,cusorg) {

                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '添加云主机',
                    width: '1000px',
                    templateUrl: 'controllers/safe/group/manage.html',
                    controller: 'SafecloudhostManageCtrl',
                    controllerAs: 'manage',
                    resolve: {
                        policyModel: function () {
                           return   SafeGroupService.getaddcloudhostlist(sgid,prjid,sgname,cusorg).then(function(response){

                               return response.data.data;
                             });





                        }
                    }

                });   result.then(function (resultData) {
                    SafeGroupService.addcloudhostlistsg(resultData).then(function (response) {
                        if (response.respCode == SysCode.success) {
                            toast.success('添加成功');
                            vm.sgcloudhostTable.api.draw();

                        } else {
                            eayunModal.error(response.message);
                        }
                    });
                })


            //    result.then(function (resultData) {
            //        FwService.SafeGroupService(resultData).then(function (response) {
            //            if (response.respCode == SysCode.success) {
            //                toast.success('策略' + (resultData.fwpName.length > 8 ? resultData.fwpName.substring(0, 7) + '...' : resultData.fwpName) + '修改规则成功');
            //                vm.table.api.draw();
            //            } else {
            //                eayunModal.error(response.message);
            //            }
            //        });
            //    })
            };


            //将云硬盘名称、描述变为可编辑状态
            vm.edit = function (type){
                if(type == 'volName'){
                    vm.hintNameShow = true;
                    vm.hintDescShow = false;
                    vm.volNameEditable = true;
                    vm.volDescEditable = false;
                }
                if(type == 'volDesc'){
                    vm.hintNameShow = false;
                    vm.hintDescShow = true;
                    vm.volNameEditable = false;
                    vm.volDescEditable = true;
                }
                vm.volEditModel = angular.copy(vm.safeGroup,{});
            };


            //取消云硬盘名称、描述的可编辑状态
            vm.cancleEdit = function (type){
                if(type == 'volName'){
                    vm.hintNameShow = false;
                    vm.volNameEditable = false;
                }
                if(type == 'volDesc'){
                    vm.hintDescShow = false;
                    vm.volDescEditable = false;
                }
            };
            //校验名称格式和唯一性
            vm.checkVolumeName = function (value) {
                var model=vm.safeGroup;
                model.volName=value;

                return  SafeGroupService.checkSecurityGroupName(model).then(function(data){

                    if(true==data){
                        return  false;
                    }else{
                        return true;
                    }
                });
            };


            //修改
            vm.saveEdit = function (value) {




                  SafeGroupService.editSecrityGroup(vm.volEditModel).then(function(data){
                      if (value == 'volName') {
                          vm.volNameEditable = false;
                          vm.hintNameShow = false;
                      }
                      if (value == 'volDesc') {
                          vm.volDescEditable = false;
                          vm.hintDescShow = false;
                      }

                        if(data.data.respCode == SysCode.success){
                            toast.success('修改成功');
                        }
                      vm.safeGroup = angular.copy(vm.volEditModel, {});

                      //vm.refreshVmInfo(vm.vmEditModel.fwId);

                });
            };
        }]);