/**
 * Created by ZHL on 2016/4/7.
 */
'use strict';

angular.module('eayun.net')
    .controller('NetBalanceVipCtrl', ['HomeCommonService', 'VipService','eayunModal','toast',
        function (HomeCommonService, VipService, eayunModal,toast) {
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
                select: [{vipName: '名称'}, {cusOrg: '客户'}, {prjName: '项目'}],
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
                source: '/api/ecmc/virtual/loadbalance/vip/listvip',
                getParams: function () {
                    var param = {};
                    param[vm.search.key] = vm.search.value;
                    param['dcId'] = vm.dcId;
                    return param;
                },
                api: {},
                result: {}
            };

            vm.refreshTable = function () {
                vm.table.api.draw();
            };

            vm.getVipStatus = function (_vipModel, _index) {
                vm.vipStatusClass[_index] = '';
                if (_vipModel.vipStatus == 'ACTIVE') {
                    return 'green';
                }
                else if (_vipModel.vipStatus == 'ERROR') {
                    return 'gray';
                }
                else if (_vipModel.vipStatus == 'PENDING_CREATE' || _vipModel.vipStatus == 'PENDING_UPDATE' || _vipModel.vipStatus == 'PENDING_DELETE') {
                    return 'yellow';
                }
            };

            vm.createVIP = function(){
              //TODO
                var result = eayunModal.dialog({
                    showBtn: true,
                    title: '创建VIP',
                    width: '600px',
                    height: '300px',
                    templateUrl: 'controllers/net/balance/vip/add.html',
                    controller: 'VipSaveCtrl',
                    controllerAs: 'add',
                    resolve: {
                        vip:{}
                    }
                });
                result.then(function (_vip) {
                    var name = _vip.vipName.length>10?_vip.vipName.substr(0,10)+"...":_vip.vipName;
                    var hint = "创建VIP" + name + "成功";
                    toast.success(hint);
                    vm.table.api.draw();
                }, function () {
                    vm.table.api.draw();
                });
            };

            vm.editVip = function(_vip){
                var result = eayunModal.dialog({
                    showBtn: true,
                    title: '编辑VIP',
                    width: '600px',
                    height: '300px',
                    templateUrl: 'controllers/net/balance/vip/edit.html',
                    controller: 'VipSaveCtrl',
                    controllerAs: 'edit',
                    resolve: {
                        vip:_vip
                    }
                });
                result.then(function (_vip) {
                    var name = _vip.name.length>10?_vip.name.substr(0,10)+"...":_vip.name;
                    var hint = "编辑VIP" + name + "成功";
                    toast.success(hint);
                    vm.table.api.draw();
                }, function () {
                    vm.table.api.draw();
                });
            };

            vm.deleteVip = function(_vip){
                var flag = vm.isDeletable(_vip);
                if(flag){
                    var name = _vip.vipName.length>9?_vip.vipName.substr(0,9)+'...':_vip.vipName;
                    eayunModal.confirm('确定要删除VIP'+name+'?').then(function () {
                        VipService.deleteVip(_vip).then(function(){
                            toast.success('删除VIP成功');
                            vm.table.api.draw();
                        });
                    });
                }else{
                    eayunModal.alert("VIP绑定的资源池存在成员，请解绑成员后再删除");
                }

            };

            vm.isDeletable= function (_vip) {
                return VipService.isDeletable(_vip);
            };

        }]);