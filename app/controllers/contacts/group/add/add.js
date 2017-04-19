/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.contacts')
    .controller('ContactsGroupAddCtrl', ['$scope', 'ContactsService', function ($scope, ContactsService) {
        $scope.group = {};

        $scope.checkGroupName = function (_value) {
            return ContactsService.checkGroupName($scope, '', _value);
        };

        $scope.commit = function () {
            $scope.ok($scope.group);
        };
    }]);