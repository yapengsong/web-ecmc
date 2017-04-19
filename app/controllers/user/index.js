/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.user', [])
    .controller('DepartmentTreeCtrl',['DepartmentService','$state',function(DepartmentService,$state){
        var vm = this;
        vm.name = 'DepartmentTreeCtrl';
        DepartmentService.getTree().then(function (tree) {
            vm.departmentTree = tree;
            $state.go('app.user.department',{department:vm.departmentTree[0].id});
        });
        vm.itemClicked= function (item) {
            item.$$isExpend = !item.$$isExpend;
            $state.go('app.user.department',{department:item.id});
        };
    }]);