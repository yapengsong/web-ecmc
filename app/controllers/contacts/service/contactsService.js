/**
 * Created by eayun on 2016/4/5.
 */
'use strict'

angular.module('eayun.contacts')
    .service('ContactsService', ['$http', 'eayunModal', 'toast', function ($http, eayunModal, toast) {
        var contactsService = {};

        contactsService.getAllCustomerList = function () {
            return $http.post('/api/ecmc/overview/getallcustomerlist').then(function (response) {
                return response.data;
            });
        };

        contactsService.addPerson = function () {
            var result = eayunModal.dialog({
                showBtn: true,
                title: '创建联系人',
                width: '600px',
                height: '400px',
                templateUrl: 'controllers/contacts/person/add/add.html',
                controller: 'ContactsPersonAddCtrl',
                resolve: {}
            });
            return result;
        };

        contactsService.editPerson = function (_person) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '编辑联系人',
                width: '600px',
                height: '400px',
                templateUrl: 'controllers/contacts/person/edit/edit.html',
                controller: 'ContactsPersonEditCtrl',
                resolve: {
                    person: _person
                }
            });
            return result;
        };

        contactsService.deletePerson = function (_contactId,name) {
            return $http.post('/api/ecmc/monitor/contact/deleteecmccontact', {contactId: _contactId,contactName:name}).then(function (response) {
                return response.data;
            })
        };

        contactsService.checkPersonName = function (_obj, _id, _name) {

                if (null != _name && _name != '') {
                    return $http.post('/api/ecmc/monitor/contact/checkecmcconname', {
                        id: _id,
                        name: _name
                    }).then(function (response) {
                        return response.data.result;
                    });
                } else {
                    return false;
                }

        };

        contactsService.getContactGroupList = function () {
            return $http.post('/api/ecmc/monitor/contact/getecmcgrouplist').then(function (response) {
                return response.data;
            });
        };

        contactsService.getContactListOutOfGroup = function (_groupId) {
            return $http.post('/api/ecmc/monitor/contact/getecmcconlistoutgroup', {groupId: _groupId}).then(function (response) {
                return response.data;
            });
        };

        contactsService.addGroup = function () {
            var result = eayunModal.dialog({
                showBtn: true,
                title: '创建联系组',
                width: '600px',
                height: '300px',
                templateUrl: 'controllers/contacts/group/add/add.html',
                controller: 'ContactsGroupAddCtrl',
                resolve: {}
            });
            return result;
        };

        contactsService.editGroup = function (_group) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '编辑联系组',
                width: '600px',
                height: '300px',
                templateUrl: 'controllers/contacts/group/edit/edit.html',
                controller: 'ContactsGroupEditCtrl',
                resolve: {
                    groups: function () {
                        return _group;
                    }
                }
            });
            return result;
        };

        contactsService.deleteGroup = function (_id,name) {
            return $http.post('/api/ecmc/monitor/contact/deleteecmcgroup', {id: _id,name:name}).then(function (response) {
                return response.data;
            });
        };

        contactsService.checkGroupName = function (_obj, _id, _name) {


                    return $http.post('/api/ecmc/monitor/contact/checkecmcgroupname', {
                        id: _id,
                        name: _name
                    }).then(function (response) {
                        return response.data.result;
                    });


        };

        contactsService.addPersonToGroup = function (_obj) {
            return $http.post('/api/ecmc/monitor/contact/addecmccontogroup', _obj).then(function (response) {
                return response.data;
            });
        };

        contactsService.removePersonFromGroup = function (_obj) {
            return $http.post('/api/ecmc/monitor/contact/removeecmcconfromgroup', _obj).then(function (response) {
                return response.data;
            });
        };

        return {
            getAllCustomerList: contactsService.getAllCustomerList,
            addPerson: contactsService.addPerson,
            editPerson: contactsService.editPerson,
            deletePerson: contactsService.deletePerson,
            checkPersonName: contactsService.checkPersonName,
            getContactGroupList: contactsService.getContactGroupList,
            getContactListOutOfGroup: contactsService.getContactListOutOfGroup,
            addGroup: contactsService.addGroup,
            editGroup: contactsService.editGroup,
            deleteGroup: contactsService.deleteGroup,
            checkGroupName: contactsService.checkGroupName,
            addPersonToGroup: contactsService.addPersonToGroup,
            removePersonFromGroup: contactsService.removePersonFromGroup
        }
    }]);