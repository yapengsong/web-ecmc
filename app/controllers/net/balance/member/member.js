/**
 * Created by liyanchao on 2016/4/19.
 */
'use strict';

angular.module('eayun.net')
    .controller('NetBalanceMemberCtrl', ['NetMemberService', '$http','toast','eayunModal',function (NetMemberService, $http,toast,eayunModal) {

        var vm = this;
        NetMemberService.getDcResourceList().then(function (response) {
            vm.dcResourceList = response.data;
        });
        //切换数据中心，刷新table
        vm.refreshTable = function (){
            vm.table.api.draw();
        };

        vm.search = '';
        vm.options = {
            searchFn: function () {
                vm.table.api.draw();
            },
            select: [{vmName: '名称'}, {cusOrg: '客户'}, {prjName: '项目'}],
            series: {
                cusOrg: {
                    multi: true,
                    data: function(){
                        return $http.post('/api/ecmc/overview/getallcustomerlist', {}).then(function(response){
                            var array = [];
                            angular.forEach(response.data,function(value){
                                array.push(value.cusOrg);
                            });
                            return array;
                        });
                    }
                },
                prjName: {
                    multi: true,
                    data: function(){
                        return $http.post('/api/ecmc/overview/getallprojectlist', {}).then(function(response){
                            var array = [];
                            angular.forEach(response.data,function(value){
                                array.push(value.prjName);
                            });
                            return array;
                        });
                    }
                }
            }
        };

        vm.dcId = '';
        vm.table = {
            source: '/api/ecmc/virtual/loadbalance/member/querymember',
            getParams: function () {
                var param = {};
                param[vm.search.key] = vm.search.value;
                param['dcId'] = vm.dcId;
                return param;
            },
            api: {},
            result: {}
        };
        /**创建成员**/
        vm.createMember = function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '创建成员',
                width: '710px',
                height: '400px',
                templateUrl: 'controllers/net/balance/member/add/add.html',
                controller: 'NetBalanceAddMemberCtrl',
                controllerAs: 'add',

            });
            result.then(function (model) {
                var name = model.vmName.length>9?model.vmName.substr(0,9)+"...":model.vmName;
                var hint = "添加成员" + name + "成功";
                toast.success(hint);
                vm.table.api.draw();
            }, function () {
                vm.table.api.draw();
            });
        };

        /**编辑成员**/
        vm.editMember = function(member){
            var result = eayunModal.dialog({
                showBtn: false,
                title: '编辑成员',
                width: '600px',
                height: '300px',
                templateUrl: 'controllers/net/balance/member/edit/edit.html',
                controller: 'NetBalanceEditMemberCtrl',
                controllerAs: 'edit',
                resolve: {
                    lbMember:function(){
                        return member;
                    }
                }

            });

            result.then(function (model) {
                NetMemberService.editMember(model).then(function () {
                    var name = model.vmName.length>9?model.vmName.substr(0,9)+"...":model.vmName;
                    var hint = "修改成员" + name + "成功";
                    toast.success(hint);
                    vm.table.api.draw();
                },function(){
                    //eayunModal.error("保存失败",500);
                });

            });

        };
        /**删除成员**/
        vm.deleteMember = function(member){
            eayunModal.confirm('确定要删除成员'+ member.memberAddress+' : '+member.protocolPort+'?').then(function () {
                NetMemberService.deleteMember(member).then(function(){
                    toast.success('删除成员成功');
                    vm.table.api.draw();
                });
            });

        };

        vm.getMemberStatus = function (_member, _index) {
            vm.memberStatusClass[_index] = '';
            if (_member.memberStatus == 'ACTIVE') {
                return 'green';
            }
            else if (_member.memberStatus == 'ERROR') {
                return 'gray';
            }
            else if (_member.memberStatus == 'PENDING_CREATE' || _member.memberStatus == 'PENDING_UPDATE' || _member.memberStatus == 'PENDING_DELETE') {
                return 'yellow';
            }
        };


    }]);