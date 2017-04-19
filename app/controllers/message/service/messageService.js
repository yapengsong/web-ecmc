/**
 * Created by eayun on 2016/4/13.
 */
'use strict'

angular.module('eayun.message')
    .service('MessageService', ['$http', '$q', 'SysCode', function ($http, $q, SysCode) {
        var messageService = {};

        messageService.addMessage = function (_message) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/system/news/createnews', _message).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.message);
                    case SysCode.error:
                        deferred.reject(response.data.message);
                }
            });
            return deferred.promise;
        };

        messageService.getTimeFlag = function (_message) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/system/news/getTimeFlag', _message).then(function (response) {
                if(response.data.respCode == SysCode.success){
                    deferred.resolve(response.data.message);
                }else{
                    deferred.reject();
                }
            });
            return deferred.promise;
        };

        messageService.editMessage = function (_message) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/system/news/updateNewsSendVOE', _message).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.message);
                    case SysCode.error:
                        deferred.reject(response.data.message);
                }
            });
            return deferred.promise;
        };

        messageService.deleteMessage = function (_message) {
            var deferred = $q.defer();

            $http.post('/api/ecmc/system/news/deleteById', {id: _message.id,name:_message.newsTitle}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.message);
                    case SysCode.error:
                        deferred.reject(response.data.message);
                }
            });
            return deferred.promise;
        };

        messageService.getReceiveList = function () {
            var deferred = $q.defer();
            $http.post('/api/ecmc/system/news/getList', {}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };

        messageService.getCount = function (_message) {
            return $http.post('/api/ecmc/system/news/getCount', _message).then(function (response) {
                return response.data;
            })
        };

        return {
            addMessage: messageService.addMessage,
            getTimeFlag: messageService.getTimeFlag,
            editMessage: messageService.editMessage,
            deleteMessage: messageService.deleteMessage,
            getReceiveList: messageService.getReceiveList,
            getCount: messageService.getCount
        };
    }]);