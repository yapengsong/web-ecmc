/**
 * Created by eayun on 2016/3/29.
 */
'use strict'

angular.module('eayun.contacts')
    .controller('ContactsGroupCtrl', ['$http', 'ContactsService', 'eayunModal', 'toast', 'SysCode', function ($http, ContactsService, eayunModal, toast, SysCode) {
        var vm = this;

        vm._groupId = '';

        vm.selected = '';

        var getContactGroupList = function () {
            ContactsService.getContactGroupList().then(function (response) {
                vm.contactGroupList = response;
                if(vm._groupId.length>0){
                    vm.getContactTable(vm._groupId);
                }else{
                    if(response.length>0){
                        vm.getContactTable(response[0].id);
                    }
                }

            });
        };

        getContactGroupList();

        vm.groupTable = {
            source: '/api/ecmc/monitor/contact/getecmcconpageingroup',
            api: {},
            getParams: function () {
                return {
                    groupId: vm._groupId || ''
                };
            }
        };

        vm.getContactTable = function (_id) {
            vm.selected = _id;
            vm._groupId = _id;
            vm.groupTable.api.draw();
            ContactsService.getContactListOutOfGroup(vm._groupId).then(function (response) {
                vm.contactListOutOfGroup = response;
            });
        };
        //添加联系组
        vm.add = function () {
            ContactsService.addGroup().then(function (group) {
                $http.post('/api/ecmc/monitor/contact/addecmcgroup', group).then(function (response) {
                    if (response.data.respCode == SysCode.success) {
                        toast.success('创建联系组' + (group.name.length > 9 ? group.name.substring(0, 8) + '...' : group.name) + '成功');
                        getContactGroupList();
                    }
                });
            });
        };
        //编辑联系组
        vm.edit = function (_contactGroup) {
            ContactsService.editGroup(_contactGroup).then(function (_group) {
                $http.post('/api/ecmc/monitor/contact/editecmcgroup', _group).then(function (response) {
                    if (response.data.respCode == SysCode.success) {
                        toast.success('编辑联系组' + (_group.name.length > 9 ? _group.name.substring(0, 8) + '...' : _group.name) + '成功');
                        getContactGroupList();
                    }
                });
            });
        };
        //删除联系组
        vm.delete = function (_contactGroup) {
            eayunModal.confirm('确定要删除联系组' + _contactGroup.name + '吗？').then(function () {
                ContactsService.deleteGroup(_contactGroup.id,_contactGroup.name).then(function (response) {
                    if (response.respCode == SysCode.success && _contactGroup.contactNum == 0) {
                        toast.success('删除联系组成功');
                        if(_contactGroup.id == vm._groupId){
                            vm.selected = '';
                            vm._groupId = '';
                            vm.contactListOutOfGroup = [];
                        }
                        getContactGroupList();
                    } else {
                        eayunModal.error('请先清除联系组内的联系人');
                    }
                });
            });
        };
        //添加联系人进组
        vm.addPersonToGroup = function (_obj) {
            ContactsService.addPersonToGroup(_obj).then(function (response) {
                if (response.respCode == SysCode.success) {
                    vm.getContactTable(_obj.groupId);
                    getContactGroupList();
                }
            });
        };
        //移除联系人从组
        vm.removePersonFromGroup = function (_obj, _name) {
            eayunModal.confirm('确定要将联系人' + _name + '在组中移除吗？').then(function () {
                ContactsService.removePersonFromGroup(_obj).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        toast.success('移除联系人成功');
                        vm.getContactTable(_obj.groupId);
                        getContactGroupList();
                    } else {
                        eayunModal.error(response.message);
                    }
                });
            });
        }
    }]);