/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.authority', [])
    .controller('AuthorityMenuTreeCtrl', ['MenuService', '$state', function (MenuService, $state) {
        var vm = this;
        MenuService.getTree().then(function (data) {
            vm.menuTree = data;
        });
        vm.itemClicked= function (item) {
            item.$$isExpend = !item.$$isExpend;
            $state.go('app.authority.menu',{menu:item.id});
        };
    }]);