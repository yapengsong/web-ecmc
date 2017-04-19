/**
 * Created by eayun on 2016/4/7.
 */
'use strict'

angular.module('eayun.notice')
    .controller('NoticeCtrl', ['eayunModal', 'NoticeService', 'toast', 'SysCode', function (eayunModal, NoticeService, toast, SysCode) {
        var vm = this;

        vm.noticeTable = {
            source: '/api/ecmc/system/notice/listNotice',
            api: {},
            getParams: function () {
                return {
                    title: vm.title,
                    isUsed: '',
                    beginTime: vm.beginTime ? vm.beginTime.getTime() : '',
                    endTime: vm.endTime ? vm.endTime.getTime() : ''
                };
            }
        };

        vm.queryTitle = function () {
            vm.noticeTable.api.draw();
        };

        vm.add = function () {
            var result = eayunModal.dialog({
                showBtn: true,
                title: '创建公告',
                width: '600px',
                templateUrl: 'controllers/notice/add/add.html',
                controller: 'NoticeAddCtrl',
                resolve: {}
            });
            result.then(function (message) {
                NoticeService.addNotice(message).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        toast.success(response.message);
                        vm.noticeTable.api.draw();
                    }
                });
            });
        };

        vm.edit = function (_notice) {
            var result = eayunModal.dialog({
                showBtn: true,
                title: '编辑公告',
                width: '600px',
                templateUrl: 'controllers/notice/edit/edit.html',
                controller: 'NoticeEditCtrl',
                controllerAs: 'edit',
                resolve: {
                	notice: _notice
                }
            });
            result.then(function (notice) {
                NoticeService.editNotice(notice).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        toast.success(response.message);
                        vm.noticeTable.api.draw();
                    }
                });
            });
        };

        vm.delete = function (_notice) {
            eayunModal.confirm('确定要删除公告吗？').then(function () {
                NoticeService.deleteNotice(_notice).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        toast.success(response.message);
                        vm.noticeTable.api.draw();
                    }
                });
            });
        };

        vm.detail = function (_notice) {
            eayunModal.dialog({
                showBtn: false,
                title: '公告详情',
                width: '800px',
                templateUrl: 'controllers/notice/detail/detail.html',
                controller: 'NoticeDetailCtrl',
                resolve: {
                    notice: function () {
                        return _notice;
                    }
                }
            });
        };
    }]);