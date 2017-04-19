/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.contacts')
    .controller('ContactsGroupEditCtrl', ['$scope', 'groups', 'ContactsService', function ($scope, _groups, ContactsService) {
        $scope.group = angular.copy(_groups,{});

        $scope.checkGroupName = function (_value) {
            return ContactsService.checkGroupName($scope, $scope.group.id, _value);
        };

        $scope.commit = function () {
            $scope.ok($scope.group);
        }
    }]);