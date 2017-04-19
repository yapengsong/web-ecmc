/**
 * Created by ZHL on 2016/3/17.
 */
'use strict';

angular.module('eayun.api')
    .controller('ApiLimitCtrl', ['$state','eayunModal','ApiLimitService', 'HomeCommonService','toast','SysCode','loginInfo', function ($state,eayunModal,ApiLimitService,HomeCommonService,toast,SysCode,loginInfo) {
        var vm = this;

        vm.dcModel = {};
        vm.isOpen = true;
        HomeCommonService.getDcList().then(function (data) {
            vm.dcList = data;
            vm.dcModel =vm.dcList[0];
        });
        vm.changeDcModel = function () {
            ApiLimitService.getApiSwitch({dcId:vm.dcModel.id}).then(function (data) {
                vm.isOpen = data.data;
            });
        };
        vm.operation = function (type) {
            vm.apiPhone = '';
            ApiLimitService.getApiSwitchPhone().then(function (response) {
                if (response.respCode == SysCode.success) {
                    vm.apiPhone = response.data;
                }
                if(null!=vm.apiPhone&&''!=vm.apiPhone){
                    var result = eayunModal.dialog({
                        title: 'API开关验证',
                        width: '600px',
                        templateUrl: 'controllers/api/limitmanage/switch/switchedit.html',
                        controller: 'SwitchEditCtrl',
                        controllerAs: 'switchedit',
                        resolve: {
                            doType : function () {
                                return type;
                            },
                            dcId : function () {
                                return vm.dcModel.id;
                            },
                            apiPhone: function(){
                                return vm.apiPhone;
                            }
                        }
                    });
                    result.then(function () {
                        vm.changeDcModel();
                    },function(){
                    });
                }else{
                    eayunModal.error('请先绑定手机号！');
                }
            });
        };



        vm.select = 'user';
        vm.clickTabs = function (type) {
            vm.select = type;
        }
        if(loginInfo.hasUIPermission('api_black')){
            vm.table = {
                api: {},
                source: '/api/ecmc/system/api/getBlackCustomer',
                result: []
            };
            vm.blackIpTable = {
                api: {},
                source: '/api/ecmc/system/api/getBlackIp',
                result: []
            };
        }

//删除黑名单客户
        vm.deleteBlackCus = function (cus) {
            console.info(cus);
            eayunModal.confirm('确定该客户移除黑名单？').then(function () {
                ApiLimitService.deleteBlack(cus).then(function(data) {
                    switch (data.data.respCode){
                        case SysCode.error:
                            eayunModal.error("移除失败");
                            vm.table.api.draw();
                            return ;
                        case SysCode.success:
                            toast.success('移除成功');
                            vm.table.api.draw();
                            return ;

                    }

                });
            });
        };
        //删除黑名单IP
        vm.deleteBlackIp = function (black) {
            eayunModal.confirm('确定该IP移除黑名单？').then(function () {
                ApiLimitService.deleteBlack(black).then(function(data) {
                    switch (data.data.respCode){
                        case SysCode.error:
                            eayunModal.error("移除失败");
                            vm.blackIpTable.api.draw();
                            return ;
                        case SysCode.success:
                            toast.success('移除成功');
                            vm.blackIpTable.api.draw();
                            return ;
                    }

                });
            });
        };
        //添加黑名单
        vm.addBlack = function (black) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '添加黑名单',
                width: '750px',
                height: '500px',
                templateUrl: 'controllers/api/limitmanage/addblack.html',
                controller: 'AddBlackCtrl',
                controllerAs: 'add',
                resolve: {
                    cusOrgList : function () {
                        return  ApiLimitService.getCustExceptBlackCus().then(function (data) {
                            return data.data;
                        });
                    }
                }


            });
            result.then(function (model) {
                console.info(model);
                ApiLimitService.addBlack(model).then(function(response){
                    switch (response.respCode){
                        case SysCode.error:
                            eayunModal.error("添加失败");
                            if(model.apiType == 'blackCus'){
                                vm.table.api.draw();
                            }else if(model.apiType == 'blackIp'){
                                vm.blackIpTable.api.draw();
                            }
                            return ;
                        case SysCode.success:
                            toast.success("添加成功");
                            if(model.apiType == 'blackCus'){
                                vm.table.api.draw();
                            }else if(model.apiType == 'blackIp'){
                                vm.blackIpTable.api.draw();
                            }
                            return ;

                    }

                });
            });
        };
        //获取api类别
        ApiLimitService.getApiType().then(function (response) {
            vm.apiTypeList = response.data;
            vm.apiType =vm.apiTypeList[0];
            vm.apiDefaultTable = {
                api: {},
                source: '/api/ecmc/system/apicount/getdefaultapicount',
                getParams: function(){
                    return {
                        version: vm.apiType.version,
                        apiType : vm.apiType.apiType
                    };
                }
            };
        });
        vm.changeApiType= function (apiType) {
            vm.apiDefaultTable.api.draw();
        };
        vm.updateCount= function (apiType) {
            var result = eayunModal.open({
                showBtn: false,
                title: '编辑默认访问次数',
                width: '600px',
                templateUrl: 'controllers/api/limitmanage/requestcount/apirestrictdefault.html',
                controller: 'apiRestrictCtrl',
                controllerAs: 'apiRestrict',
                resolve: {
                    apiType : function () {
                        return apiType;
                    }
                }
            }).result;
            result.then(function (apiAction) {
                ApiLimitService.updateApiRequestCount(apiAction.list,apiAction.version,apiAction.apiTypeName,apiAction.apiType).then(function (response) {
                    switch (response.respCode) {
                        case SysCode.error:
                            eayunModal.error("编辑失败");
                            vm.apiDefaultTable.api.draw();
                            return;
                        case SysCode.success:
                            toast.success("编辑成功");
                            vm.apiDefaultTable.api.draw();
                            return;
                        default:
                            return;
                    }
                });
            }, function () {
                
            })
        }
    }]);