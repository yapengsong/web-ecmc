/**
 * Created by eayun on 2016/6/12.
 */
'use strict'

angular.module('eayun.mailsms')
    .controller('MailListCtrl', ['MailService', 'eayunModal', 'SysCode', 'toast', '$scope', '$timeout', function (MailService, eayunModal, SysCode, toast, $scope, $timeout) {
        var vm = this;
        vm.mailTable = {
            source: '/api/ecmc/mailbll/getmaillist',
            api: {},
            getParams: function () {
                return {
                    beginTime: vm.beginTime ? vm.beginTime.getTime() : null,
                    endTime: vm.endTime ? vm.endTime.getTime() : null,
                    title: vm.mailTitle ? vm.mailTitle : null,
                    status: vm.status ? vm.status : null
                }
            },
            result: []
        };

        MailService.getMailStatusList().then(function (response) {
            vm.statusList = response.data;
        });
        vm.seeUserMail = function (userMail) {
            vm.userMail(userMail, false);
        };
        vm.sendMailByUser = function (userMail) {
            vm.userMail(userMail, true);
        };
        vm.userMail = function (mail, showCheckBox) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '邮箱',
                width: '600px',
                templateUrl: 'controllers/mail/user_mail.html',
                controller: ['userMailList', 'showCheckBox', '$scope', 'mailId', function (userMailList, showCheckBox, $scope, mailId) {
                    var vm = this;
                    vm.mailList = userMailList;
                    vm.showCheckBox = showCheckBox;
                    var choseArr = [];//定义数组用于存放前端显示
                    vm.checkBoxAll = false;//默认未选中
                    vm.showBtnCom = true;
                    vm.checkAll = function () {//全选
                        if (vm.checkBoxAll) {
                            vm.checkBoxAll = true;
                            $scope.userMail = true;
                            vm.showBtnCom = false;
                            choseArr = userMailList;
                        } else {
                            vm.checkBoxAll = false;
                            $scope.userMail = false;
                            vm.showBtnCom = true;
                            choseArr = [""];
                        }
                    };
                    var str = "";//
                    vm.checkOther = function (mail, userMail) {//单选或者多选
                        if (userMail) {//选中
                            str = str + mail + ',';
                        } else {
                            str = str.replace(mail + ',', '');//取消选中
                        }
                        if (str.length == 0) {
                            choseArr = [""];
                            vm.showBtnCom = true;
                        } else {
                            choseArr = (str.substr(0, str.length - 1)).split(',');
                            vm.showBtnCom = false;
                        }
                    };

                    $scope.commit = function () {
                        if (choseArr.length == 0) {
                            return;
                        }
                        var mail = new Object();
                        mail.mailId = mailId;
                        mail.userMailList = choseArr;
                        $scope.ok(mail);
                    }

                }],
                controllerAs: 'mailList',
                resolve: {
                    userMailList: function () {
                        return mail.userMailList;
                    },
                    mailId: function () {
                        return mail.id;
                    },
                    showCheckBox: function () {
                        return showCheckBox;
                    }
                }
            });
            result.then(function (repDate) {
                MailService.sendMailByUser(
                    repDate.mailId,
                    mail.title,
                    repDate.userMailList
                ).then(function (response) {
                    switch (response.respCode) {
                        case SysCode.error:
                            eayunModal.error(response.message);
                            return;
                        case SysCode.success:
                            toast.success('重发成功!');
                            vm.mailTable.api.draw();
                            return;
                        default:
                            toast.success("重发成功!");
                            vm.mailTable.api.draw();
                            return;
                    }

                });
            });
        };
        vm.refresh = function () {
            for (var i = 0; i < vm.mailTable.result.length; i++) {
                if ("0" === vm.mailTable.result[i].status) {
                    vm.mailTable.api.refresh();
                    break;
                }
            }
        }
    }]);