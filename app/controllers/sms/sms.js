/**
 * Created by eayun on 2016/6/8.
 */
'use strict'

angular.module('eayun.mailsms')
    .controller('SmsCtrl', ['eayunModal', 'toast', 'SmsService', function (eayunModal, toast, SmsService) {
        var vm = this;

        vm.table = {
            api: {},
            source: '/api/ecmc/system/sms/getsmslist',
            getParams: function () {
                return {
                    begin: vm.beginTime ? vm.beginTime.getTime() : '',
                    end: vm.endTime ? vm.endTime.getTime() : '',
                    mobile: vm.mobile ? vm.mobile : '',
                    status: vm.smsStatus ? vm.smsStatus : ''
                };
            },
            result: []
        };
        /*自动刷新*/
        vm.refresh = function () {
            var i, item;
            for (i = 0; i < vm.table.result.length; i++) {
                item = vm.table.result[i];
                if (item.status == '未发送') {
                    vm.table.api.refresh();
                    break;
                }
            }
        };
        /*查询短信*/
        vm.queryTable = function () {
            vm.table.api.draw();
        };
        /*创建短信*/
        vm.create = function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '创建短信',
                width: '600px',
                templateUrl: 'controllers/sms/create.html',
                controller: 'SmsCreateCtrl',
                controllerAs: 'create',
                resolve: {}
            });
            result.then(function (smsModel) {
                SmsService.create(smsModel).then(function (response) {
                    if (response) {
                        toast.success("短信创建成功！正在发送中");
                        vm.table.api.draw();
                    } else {
                        toast.error("创建失败");
                    }
                }, function () {
                });
            });
        };

        /*重新发送*/
        vm.resend = function (_id) {
            eayunModal.confirm('确定重新发送该短信吗？').then(function () {
                SmsService.resend(_id).then(function (response) {
                    if (response) {
                        toast.success('短信重新发送中');
                        vm.table.api.draw();
                    } else {
                        toast.error('重新发送失败!该条短信信息已经被删除');
                    }
                }, function () {

                });
            });
        };

    }]);