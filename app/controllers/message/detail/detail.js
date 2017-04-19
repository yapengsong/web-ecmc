/**
 * Created by eayun on 2016/4/7.
 */
'use strict'

angular.module('eayun.message')
    .controller('MessageDetailCtrl', ['$scope', 'message', 'MessageService', 'SysCode', function ($scope, message, MessageService, SysCode) {
        $scope.message = message;
        $scope.message.endDate = message.sendDate + 2592000000;

        MessageService.getCount(message).then(function (response) {
            if (response.respCode == SysCode.success) {
                $scope.message = response.data;
            }
        });
    }]);