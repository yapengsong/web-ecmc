/**
 * Created by eayun on 2016/4/9.
 */
'use strict'

angular.module('eayun.role')
    .controller('RoleSaveCtrl', ['role', '$scope', 'RoleService', 'eayunModal','toast',
        function (_role, $scope, RoleService, eayunModal,toast) {
            var vm = this;
            vm.role = angular.copy(_role,{});
            vm.checkName= function (value) {
                return RoleService.validName(value,vm.role.id);
            };
            $scope.commit = function () {
                var promise;
                if (vm.role.id) {
                    promise = RoleService.edit(vm.role);
                } else {
                    promise = RoleService.add(vm.role);
                }
                promise.then(function (data) {
                    toast.success('保存成功');
                    $scope.ok(data);
                }, function (msg) {
                    eayunModal.error(msg);
                });
            };
        }]);