/**
 * Created by eayun on 2016/4/9.
 */
'use strict'

angular.module('eayun.role')
    .controller('ViewRoleAuthCtrl', ['role', '$scope', 'RoleService','MenuService','AuthorityService', 'eayunModal','toast',
        function (_role, $scope, RoleService,MenuService,AuthorityService,eayunModal,toast) {
            var vm = this;
            vm.role = angular.copy(_role,{});
            vm.menusId=[];//角色拥有的菜单ID列表
            vm.authId=[];//角色拥有的权限ID列表

            //查询角色拥有的菜单和权限
            RoleService.getMenuAuthByRoleId(vm.role.id).then(function (data) {
                angular.forEach(data.menus, function (data) {
                    vm.menusId.push(data.id);
                });
                angular.forEach(data.authorities, function (data) {
                    vm.authId.push(data.id);
                });
            }).then(function(){
                //获取所有菜单
                MenuService.getTree().then(function (data) {
                    vm.menuTree = data;
                    //vm.itemClicked(vm.menuTree[0]);
                    //
                    vm.initMenuCheckBox(vm.menuTree);
                });

                //查询所有可用权限
                AuthorityService.getAllEnableAuth().then(function(data){
                    vm.authList = data;
                    angular.forEach(vm.authList, function (data) {
                        angular.forEach(vm.authId,function (value) {
                            if(data.id==value){
                                data.$$isChecked=true;
                            }
                        });
                    });
                });
            });

            vm.initMenuCheckBox = function(menuList){
                angular.forEach(menuList, function (menu) {
                    angular.forEach(vm.menusId,function (value) {
                        if(menu.id==value){
                            menu.$$isChecked=true;
                        }
                        if(menu.children && menu.children.length > 0){
                            vm.initMenuCheckBox(menu.children);
                        }
                    });
                });
            };
        }]);