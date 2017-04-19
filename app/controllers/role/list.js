/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.role')
    .controller('RoleCtrl', ['RoleService', 'eayunModal','toast', function (RoleService, eayunModal,toast) {
        var vm = this;

        RoleService.queryAll().then(function (list) {
            vm.list = list;
        });

        vm.add = function () {
            var result = eayunModal.dialog({
                title: '创建角色',
                width: '800px',
                templateUrl: 'controllers/role/edit.html',
                controller: 'RoleSaveCtrl',
                controllerAs: 'edit',
                resolve: {
                    role: {}
                }
            });
            result.then(function () {
                RoleService.queryAll().then(function (list) {
                    vm.list = list;
                });
            });
        };

        vm.edit = function (role) {
            var result = eayunModal.dialog({
                title: '编辑角色',
                width: '800px',
                templateUrl: 'controllers/role/edit.html',
                controller: 'RoleSaveCtrl',
                controllerAs: 'edit',
                resolve: {
                    role: role
                }
            });
            result.then(function () {
                RoleService.queryAll().then(function (list) {
                    vm.list = list;
                });
            });
        };
        vm.setAuthority= function (role) {
            var result = eayunModal.dialog({
                title: '配置角色权限>' + role.name,
                width: '800px',
                templateUrl: 'controllers/role/set.html',
                controller: 'RoleSetCtrl',
                controllerAs: 'set',
                resolve: {
                    role: role
                }
            });
            result.then(function () {
                RoleService.queryAll().then(function (list) {
                    vm.list = list;
                });
            });
        };

        vm.viewAuthority = function(_role){
            var result = eayunModal.dialog({
                title: '查看角色权限>' + _role.name,
                width: '800px',
                templateUrl: 'controllers/role/auth/view.html',
                controller: 'ViewRoleAuthCtrl',
                controllerAs: 'set',
                showBtn: false,
                resolve: {
                    role: _role
                }
            });
        }
        vm.delete = function (roleId) {
            var promise;
            eayunModal.confirm('确定删除角色？').then(
                function() {
                   promise= RoleService.delete(roleId);
                    promise.then(function (data) {
                        toast.success('删除成功');
                        RoleService.queryAll().then(function (list) {
                            vm.list = list;
                        });
                    }, function (msg) {
                        eayunModal.error(msg);
                    });
                });

        };
    }]);