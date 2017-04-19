/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.menu')
    .controller('MenuListCtrl', ['MenuService', 'eayunModal','toast','$stateParams','$state','MenuDepartmentTree',
        function (MenuService, eayunModal,toast,$stateParams,$state,MenuDepartmentTree) {
        var vm = this;
        var _menu={};
        MenuService.getMenuById($stateParams.menu).then(function (data) {
            vm.menu = data;
            _menu.parentId=data.id;
        });
        MenuService.getTree().then(function (data) {
            vm.tree = data;
        });
        vm.itemClicked= function (item) {
            item.$$isExpend = !item.$$isExpend;
            $state.go('app.menu.menulist',{menu:item.id});
        };
        vm.add = function (menu) {
            console.debug("parentId:" + _menu.parentId);
            if(_menu.parentId == undefined){
                //console.log("reset");
                _menu.parentId = "";
            }
            var result = eayunModal.dialog({
                title: '创建菜单',
                width: '500px',
                templateUrl: 'controllers/menu/edit.html',
                controller: 'MenuEditCtrl',
                controllerAs: 'edit',
                resolve: {
                    menu: _menu
                }
            });
            result.then(function () {
                MenuService.getTree().then(function (data) {
                    MenuDepartmentTree.setTreeData(data);
                    MenuService.getMenuById(menu.id).then(function (value) {
                        vm.menu = value;
                    });
                });
            });
        };

        vm.edit = function (menu) {
            var result = eayunModal.dialog({
                title: '编辑菜单',
                width: '500px',
                templateUrl: 'controllers/menu/edit.html',
                controller: 'MenuEditCtrl',
                controllerAs: 'edit',
                resolve: {
                    menu: menu
                }
            });
            result.then(function () {
                MenuService.getTree(menu.id).then(function (data) {
                    MenuDepartmentTree.setTreeData(data);
                    MenuService.getMenuById(menu.id).then(function (value) {
                        vm.menu = value;
                    });
                });
            });
        };

        vm.delete = function (menu) {
            var promise;
            eayunModal.confirm('确定删除菜单？').then(
                function() {
                    MenuService.checkDel(menu.id).then(function (data) {
                        if(data.data){
                            promise=MenuService.delete(menu.id);
                            toast.success('删除菜单成功!');
                            promise.then(function () {
                                MenuService.getTree().then(function (data) {
                                    MenuDepartmentTree.setTreeData(data);
                                });
                                if(menu.parentId && menu.parentId != undefined){
                                    MenuService.getMenuById(menu.parentId).then(function (data) {
                                        vm.menu = data;
                                        vm.itemClicked(vm.menu);
                                    });
                                }else{
                                    //如果不存在父Id，展示第一个机构
                                    vm.menu = MenuDepartmentTree.getData().treeData[1];
                                    vm.itemClicked(vm.menu);
                                }
                            }, function (msg) {
                                eayunModal.error(msg);
                            });
                        }else{
                            eayunModal.warning(data.message);
                        }
                    });

                });

        }
    }]);