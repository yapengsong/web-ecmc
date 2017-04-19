/**
 * Created by eayun on 2016/3/29.
 */
'use strict'

angular.module('eayun.contacts')
    .controller('ContactsPersonCtrl', ['$http', 'ContactsService', 'eayunModal', 'toast', function ($http, ContactsService, eayunModal, toast) {
        var vm = this;

        vm.radioFirst = '0';

        ContactsService.getAllCustomerList().then(function (response) {
            vm.allCustomerList = response;
        });

        vm.queryTable = function () {
            vm.personTable.api.draw();
        };

        vm.search = '';
        vm.options = {
            placeholder: "请输入联系人名称搜索",
            searchFn: function () {
                vm.personTable.api.draw();
            }
        };

        vm.personTable = {
            source: '/api/ecmc/monitor/contact/getecmcpagecontactlist',
            api: {},
            getParams: function () {
                return {
                    name: vm.search,
                    type: vm.radioFirst,
                    cusId: vm.radioFirst == '1' ? vm.cusId : ''
                };
            }
        };

        //创建联系人
        vm.add = function () {
            ContactsService.addPerson().then(function (person) {
                $http.post('/api/ecmc/monitor/contact/addecmccontact', person).then(function (response) {
                    toast.success('创建联系人' + (person.name.length > 9 ? person.name.substring(0, 8) + '...' : person.name) + '成功');
                    vm.personTable.api.draw();
                });
            });
        };
        //编辑联系人
        vm.edit = function (person) {
            ContactsService.editPerson(person).then(function (_person) {
                $http.post('/api/ecmc/monitor/contact/editecmccontact', _person).then(function (response) {
                    if (response.data) {
                        toast.success('编辑联系人' + (_person.name.length > 9 ? _person.name.substring(0, 8) + '...' : _person.name) + '成功');
                    }
                    vm.personTable.api.draw();
                })
            });
        };
        //更改通知方式
        vm.updateConnect = function ($event, _object) {
            console.log(_object.smsNotify);
            var checkbox = $event.target;
            var _isCheck = checkbox.checked ? '1' : '0';
            $http.post('/api/ecmc/monitor/contact/updateecmcselection', {
                mcId: _object.mcId,
                type: _object.type,
                isChecked: _isCheck,
                mcName:_object.mcName
            }).then(function (response) {
                if (response.data.respCode == '000000') {
                    toast.success('更新通知方式成功！')
                }
                vm.personTable.api.draw();
            });
        };
        //删除联系人
        vm.delete = function (_contactPerson) {
            eayunModal.confirm('确定删除该联系人' + _contactPerson.name + '吗？').then(function () {
                ContactsService.deletePerson(_contactPerson.id,_contactPerson.name).then(function (response) {
                    if (response.respCode == '000000') {
                        toast.success('删除联系人成功');
                        vm.personTable.api.draw();
                    } else {
                        eayunModal.error(response.data.message);
                    }
                });
            });
        }
    }]);