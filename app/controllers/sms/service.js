/**
 * Created by eayun on 2016/6/8.
 */
'use strict'

angular.module('eayun.mailsms')
    .service('SmsService', ['$q', '$http', 'SysCode', function ($q, $http, SysCode) {
        var vm = this;
        /* 创建短信 */
        vm.create = function (_smsModel) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/system/sms/createsms', {
                detail: _smsModel.detail,
                mobilesList: _smsModel.mobilesList
            }).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        /* 短信重发 */
        vm.resend = function (_id) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/system/sms/resendsms', {id: _id}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
    }]);