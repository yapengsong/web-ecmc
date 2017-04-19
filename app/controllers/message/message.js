/**
 * Created by eayun on 2016/4/7.
 */
'use strict'

angular.module('eayun.message')
    .controller('MessageCtrl', ['eayunModal', 'MessageService', 'toast', 'SysCode', function (eayunModal, MessageService, toast, SysCode) {
        var vm = this;
        vm.message={};
        vm.messageTable = {
            source: '/api/ecmc/system/news/getnewslist',
            api: {},
            getParams: function () {
                return {
                    title: vm.title,
                    begin: vm.beginTime ? vm.beginTime.getTime() : '',
                    end: vm.endTime ? vm.endTime.getTime() + 86400000 - 1 : '',
                    issyssend:vm.issyssend
                };
            }
        };

        vm.queryTable = function () {
            vm.messageTable.api.draw();
        };

        vm.add = function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '创建消息',
                width: '600px',
                templateUrl: 'controllers/message/add/add.html',
                controller: 'MessageAddCtrl',
                controllerAs: 'add',
                resolve: {}
            });
            result.then(function (message) {
                MessageService.addMessage(message).then(function (msg) {
                    toast.success(msg);
                    vm.messageTable.api.draw();
                }, function (msg) {
                    toast.error(msg);
                });
            });
        };

        vm.edit = function (_message) {
            MessageService.getTimeFlag(_message).then(function (msg) {
                toast.error(msg);
                return;
            }, function () {
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '编辑消息',
                    width: '600px',
                    templateUrl: 'controllers/message/edit/edit.html',
                    controller: 'MessageEditCtrl',
                    controllerAs: 'edit',
                    resolve: {
                        message: function () {
                            vm.message= _message
                           // console.info(vm.message);
                            //vm.customerList=resultData;
                            //vm.message.cusLists=vm.message.cusCpname;

                            return _message;
                        },
                        cusLists:function(){
                           return  vm.cusLists=vm.message.cusCpname;
                        }
                    }
                });
                result.then(function (message) {
                    MessageService.editMessage(message).then(function (msg) {
                        toast.success(msg);
                        vm.messageTable.api.draw();
                    }, function (msg) {
                        toast.error(msg);
                    });
                });
            });
        };

        vm.delete = function (_message) {
            eayunModal.confirm('确定要删除消息吗？').then(function () {
                MessageService.deleteMessage(_message).then(function (msg) {
                    toast.success(msg);
                    vm.messageTable.api.draw();
                }, function () {
                    toast.error('该条消息已经生效，无法删除！');
                });
            });
        };

        vm.detail = function (_message) {
            eayunModal.dialog({
                showBtn: false,
                title: '消息详情',
                width: '800px',
                templateUrl: 'controllers/message/detail/detail.html',
                controller: 'MessageDetailCtrl',
                resolve: {
                    message: function () {
                        return _message;
                    }
                }
            });
        };
    }]);