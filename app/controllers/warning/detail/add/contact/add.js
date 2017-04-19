/**
 * Created by eayun on 2016/4/12.
 */
'use strict'

angular.module('eayun.warning')
    .controller('WarningRuleDetailContactAddCtrl', ['$scope', 'ruleId','ruleName', 'WarningService', function ($scope, ruleId,ruleName, WarningService) {
        $scope.allContactList = [];
        $scope.allContactGroup = [];
        $scope.selectedContact = [];

        WarningService.getSelectedContact(ruleId).then(function (data) {
            $scope.selectedContact = data;
        });

        WarningService.getAllContactGroupBy().then(function (data) {
            $scope.allContactGroup = data;
        });

        WarningService.getAllContactList().then(function (data) {
            $scope.allContactList = data;
        });

        $scope.addAll = function () {
            $scope.addAllContactToRule($scope.allContactList);
        };

        $scope.addContactToRule = function (_contact) {
            if (!WarningService.containsItemInContact($scope.selectedContact, _contact)) {
                $scope.selectedContact.push(_contact);
                $scope.selectedNumber = $scope.selectedContact.length;
            }
        };

        $scope.addAllContactToRule = function (_contactList) {
            angular.forEach(_contactList, function (value) {
                $scope.addContactToRule(value);
            });
        };

        $scope.deleteContactFromRule = function (_contact) {
            for (var i = 0; i < $scope.selectedContact.length; i++) {
                if ($scope.selectedContact[i].contactId == _contact.contactId) {
                    $scope.selectedContact.splice(i, 1);
                    break;
                }
            }
            $scope.selectedNumber = $scope.selectedContact.length;
        };

        $scope.commit = function () {
            var _contactIds = [];
            for (var i = 0; i < $scope.selectedContact.length; i++) {
                _contactIds.push($scope.selectedContact[i].contactId);
            }
            $scope.params = {
                ruleId: ruleId,
                contactIds: _contactIds,
                ruleName:ruleName
            };
            $scope.ok($scope.params);
        };
    }]);