/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.authority')
    .controller('AuthorityListCtrl', ['AuthorityService', '$stateParams', 'eayunModal','toast',
        function (AuthorityService, $stateParams, eayunModal,toast) {
            var vm = this;

            vm.table = {
                source: '/api/ecmc/system/authority/findauthoritylist',
                getParams: function () {
                    return {menuId: $stateParams.menu};
                },
                api: {}
            };

            vm.add = function () {
                var result = eayunModal.dialog({
                    showBtn: true,
                    title: '创建权限',
                    width: '800px',
                    templateUrl: 'controllers/authority/edit.html',
                    controller: 'AuthorityEditCtrl',
                    controllerAs: 'edit',
                    resolve: {
                        auth: {}
                    }
                });
                result.then(function () {
                    vm.table.api.draw();
                });
            };

            vm.edit = function (auth) {
                var result = eayunModal.dialog({
                    showBtn: true,
                    title: '编辑权限',
                    width: '800px',
                    templateUrl: 'controllers/authority/edit.html',
                    controller: 'AuthorityEditCtrl',
                    controllerAs: 'edit',
                    resolve: {
                        auth: auth
                    }
                });
                result.then(function () {
                    vm.table.api.draw();
                });
            };

            vm.delete = function (authId) {
                var promise;
                eayunModal.confirm('确定删除权限？').then(
                    function() {
                        promise=AuthorityService.delete(authId);
                        promise.then(function (data) {
                            toast.success('删除成功');
                            vm.table.api.draw();
                        }, function (msg) {
                            eayunModal.warning(msg);
                        });
                    });

            };
            vm.fmtPermission = function(value){
                if(value){
                    return  value.replace(/;/g,';<br>') ;
                }
                return '';
            }
        }]);