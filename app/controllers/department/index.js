/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.department')
    .controller('DepartmentIndexCtrl', ['DepartmentService', '$state', function (DepartmentService, $state) {
        var vm = this;
        DepartmentService.getTree().then(function (data) {
            vm.menuTree = data;
        });
        vm.itemClicked= function (item) {
            item.$$isExpend = !item.$$isExpend;
            $state.go('app.department.department',{department:item.id});
        };
    }]);