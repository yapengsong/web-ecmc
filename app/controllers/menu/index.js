/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.menu')
    .controller('MenuIndexCtrl', ['MenuService', '$state', 'MenuDepartmentTree',
        function (MenuService, $state,MenuDepartmentTree) {
        var vm = this;
            vm.data = MenuDepartmentTree.getData();
        MenuService.getTree().then(function (data) {
            MenuDepartmentTree.setTreeData(data);
        });
        vm.itemClicked= function (item) {
            item.$$isExpend = !item.$$isExpend;
            $state.go('app.menu.menulist',{menu:item.id});
        };
    }]);