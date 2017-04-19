/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.contacts')
    .controller('ContactsPersonEditCtrl', ['$scope', 'person', 'ContactsService', function ($scope, _person, ContactsService) {
        $scope.person = angular.copy(_person,{});

        $scope.checkContactName = function (value) {
            return ContactsService.checkPersonName($scope, $scope.person.id, value);
        };

        $scope.commit = function () {
            $scope.ok($scope.person);
        }
    }]);