/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.user')
    .controller('UserListCtrl', ['UserService', '$stateParams', 'eayunModal','toast',
        function (UserService, $stateParams, eayunModal,toast) {
            var vm = this;
            vm.table = {
                source: '/api/ecmc/system/user/finduserlist',
                getParams: function () {
                    return {departId: $stateParams.department};
                },
                api: {}
            };

            vm.add = function () {
                var result = eayunModal.dialog({
                    title: '创建用户',
                    width: '800px',
                    templateUrl: 'controllers/user/edit.html',
                    controller: 'UserSaveCtrl',
                    controllerAs: 'edit',
                    resolve: {
                        user: {}
                    }
                });
                result.then(function () {
                    vm.table.api.draw();
                });
            };

            vm.edit = function (user) {
                var result = eayunModal.dialog({
                    title: '编辑用户',
                    width: '800px',
                    templateUrl: 'controllers/user/edit.html',
                    controller: 'UserSaveCtrl',
                    controllerAs: 'edit',
                    resolve: {
                        user: user
                    }
                });
                result.then(function () {
                    vm.table.api.draw();
                });
            };

            vm.delete = function (userId) {
                eayunModal.confirm('确定删除用户？').then(
                    function () {
                        UserService.delete(userId).then(function () {
                            toast.success('删除成功');
                            vm.table.api.draw();
                        }, function (msg) {
                            eayunModal.error(msg);
                        });
                    });
            }

            vm.roleNames = function(roles){
                if(!roles){
                    return '';
                }
                var roleNames = new Array();
                for(var i in roles){
                    roleNames[i] = roles[i].name;
                }
                return roleNames.join(", ")
            }
        }]);