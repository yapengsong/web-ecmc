/**
 * Created by ZHL on 2016/4/7.
 */
'use strict';

angular.module('eayun.safe')
    .controller('SafeGroupListCtrl', ['SafeGroupService', 'HomeCommonService','loginInfo', '$http', 'eayunModal','toast' ,
        function (SafeGroupService, HomeCommonService,loginInfo, $http, eayunModal, toast) {
        var vm = this;

        vm.dcResourceList = {};

        SafeGroupService.getDcResourceList().then(function (response) {
            vm.dcResourceList = response.data;
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
        vm.dcId = '';
        vm.table = {
            source: '/api/ecmc/virtual/securitygroup/querysecuritygroup',
            getParams: function () {
                var param = {};
                param[vm.search.key] = vm.search.value;
                param['dcId'] = vm.dcId;
                return param;
            },
            api: {},
            result: {}
        };

        vm.createSecurityGroup = function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '创建安全组',
                width: '600px',
                height: '300px',
                templateUrl: 'controllers/safe/group/edit.html',
                controller: 'SafeGroupSaveCtrl',
                controllerAs: 'edit',
                resolve: {
                    safeGroup:{},
                }
            });
            result.then(function (_sg) {
                var name = _sg.sgName.length>9?_sg.sgName.substr(0,9)+"...":_sg.sgName;
                var hint = "添加安全组" + name + "成功";
                toast.success(hint);
                vm.table.api.draw();
            }, function () {
                vm.table.api.draw();
            });
        };

        vm.editSecurityGroup = function (_sg) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '编辑安全组',
                width: '600px',
                height: '300px',
                templateUrl: 'controllers/safe/group/edit/edit.html',
                controller: 'SafeGroupEditCtrl',
                controllerAs: 'editGroup',
                resolve: {
                    safeGroup:_sg,
                }
            });
            result.then(function (_sg) {
                var name = _sg.sgName.length>9?_sg.sgName.substr(0,9)+"...":_sg.sgName;
                var hint = "编辑安全组" + name + "成功";
                toast.success(hint);
                vm.table.api.draw();
            }, function () {
                vm.table.api.draw();
            });
        };

        vm.detail = function (_id,cusOrg) {

            SafeGroupService.goSafeGroupDetail(_id,cusOrg);
        };

        vm.refreshTable = function (){
            vm.table.api.draw();
        };





            vm.deleteGroup = function (_sg) {
                eayunModal.confirm('确定要删除安全组'+_sg.sgName+'?').then(function () {

                    SafeGroupService.deleteSafeGroup(_sg).then(function(data) {

                        if (data.data.respCode =='010120') {
                            eayunModal.error(data.data.message);
                            vm.table.api.draw();}else{
                            toast.success('删除成功');
                            vm.table.api.draw();
                        }

                    });
                });
            };




    }]);