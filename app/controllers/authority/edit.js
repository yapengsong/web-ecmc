/**
 * Created by eayun on 2016/4/11.
 */
'use strict'

angular.module('eayun.authority')
    .controller('AuthorityEditCtrl', ['auth', '$scope', 'AuthorityService', 'eayunModal', 'MenuService','toast',
        function (_auth, $scope, AuthorityService, eayunModal, MenuService,toast) {
            var vm = this;
            vm.auth = angular.copy(_auth,{});
            if(vm.auth.enableFlag=='1'){
                vm.auth.enableFlag=true;
            }else{
                vm.auth.enableFlag=false;
            }
            MenuService.getTree().then(function (data) {
                vm.menuTree = data;
            });
            $scope.commit = function () {
                vm.auth2 = angular.copy(vm.auth,{});
                if(vm.auth2.enableFlag){
                    vm.auth2.enableFlag='1';
                }else{
                    vm.auth2.enableFlag='0';
                }
                var promise;
                if (vm.auth2.id) {
                    promise = AuthorityService.edit(vm.auth2);
                } else {
                    promise = AuthorityService.add(vm.auth2);
                }
                promise.then(function (data) {
                    toast.success('保存成功');
                    $scope.ok(data);
                }, function (msg) {
                    eayunModal.error(msg);
                });
            };
        }]);