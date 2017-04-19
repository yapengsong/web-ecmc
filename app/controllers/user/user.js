/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.user')
    .controller('UserCtrl', ['UserService', function (UserService) {
        var vm = this;

        vm.guide = 'operation';

        vm.changeGuide = function (str) {
            vm.guide = str;
        };

        vm.userTable = {
            source: '',
            api: {},
            getSource: function () {
                return {};
            }
        };

        vm.add = function () {
            UserService.addUser().then(function (response) {

            });
        };

        vm.edit = function () {
            UserService.editUser().then(function (response) {

            });
        };

        vm.delete = function () {
            UserService.deleteUser().then(function (response) {

            });
        };
    }]);