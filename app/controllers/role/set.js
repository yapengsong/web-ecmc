/**
 * Created by eayun on 2016/4/9.
 */
'use strict'

angular.module('eayun.role')
    .controller('RoleSetCtrl', ['role', '$scope', 'RoleService','MenuService','AuthorityService', 'eayunModal','toast',
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
            //departed
            vm.itemClicked= function (item) {
                vm.menuId=item.id;
                RoleService.getAuthByMenuId(item.id).then(function (data) {
                    vm.authList=data;
                    angular.forEach(vm.authList, function (data) {
                        angular.forEach(vm.authId,function (value) {
                            if(data.id==value){
                                data.$$isChecked=true;
                            }
                        });
                    });
                });
            };
            vm.itemCheckedChanged= function (item) {
                var num=vm.menusId.indexOf(item.id);
                if(item.$$isChecked){
                    if(num=='-1'){
                        vm.menusId.push(item.id);
                    }
                }else{
                    if(num!='-1'){
                        vm.menusId.splice(num,1);
                    }
                }
            };
            vm.click= function (item) {
                var num=vm.authId.indexOf(item.id);
                if(item.$$isChecked){
                    if(num=='-1'){
                        vm.authId.push(item.id);
                    }
                }else{
                    if(num!='-1'){
                        vm.authId.splice(num,1);
                    }
                }
            };

            $scope.commit = function () {
                var promise;
                promise = RoleService.setAuthority(vm.role.id,vm.menusId,vm.authId);
                promise.then(function (data) {
                    toast.success('保存成功');
                    $scope.ok(data);
                }, function (msg) {
                    eayunModal.error(msg);
                });
            };

        }]);