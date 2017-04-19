/**
 * Created by eayun on 2016/4/7.
 */
'use strict'

angular.module('eayun.notice')
    .controller('NoticeDetailCtrl', ['$scope', 'notice', function ($scope, notice) {
        $scope.notice = notice;
    }]);