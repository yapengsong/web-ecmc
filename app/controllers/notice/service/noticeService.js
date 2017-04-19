/**
 * Created by eayun on 2016/4/13.
 */
'use strict'

angular.module('eayun.notice')
    .service('NoticeService', ['$http', 'eayunModal', 'SysCode', 'toast', function ($http, eayunModal, SysCode, toast) {
        var noticeService = {};

        noticeService.addNotice = function (_notice) {
            return $http.post('/api/ecmc/system/notice/createNotice', _notice,{$showLoading : true}).then(function (response) {
                return response.data;
            });
        };

        noticeService.editNotice = function (_notice) {
            return $http.post('/api/ecmc/system/notice/modifyNotice', _notice,{$showLoading : true}).then(function (response) {
                return response.data;
            });
        };

        noticeService.deleteNotice = function (_notice) {
            return $http.post('/api/ecmc/system/notice/deleteNotice', _notice,{$showLoading : true}).then(function (response) {
                return response.data;
            });
        };

        return {
            addNotice: noticeService.addNotice,
            editNotice: noticeService.editNotice,
            deleteNotice: noticeService.deleteNotice
        };
    }]);