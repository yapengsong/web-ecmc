/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.department')
    .controller('DepartmentCtrl', ['DepartmentService', 'eayunModal','toast','$stateParams','$state', function (DepartmentService, eayunModal,toast,$stateParams,$state) {
        var vm = this;
        var deId=$stateParams.department;
        vm.dep={};
        //DepartmentService.getDepartment($stateParams.department).then(function (data) {
        //    vm.department = data;
        //    vm.dep.parentId=data.id;
        //});
        DepartmentService.getTree().then(function (data) {
            vm.menuTree = data;
            vm.itemClicked( vm.dep.parentId==null?data[0]: vm.dep.parentId);
        });
        vm.itemClicked= function (item) {
            item.$$isExpend = !item.$$isExpend;
            DepartmentService.getDepartment(item.id).then(function (data) {
                vm.department = data;
                vm.dep.parentId=data.id;
            });
        };
        vm.add = function () {
            var _dep = vm.dep;
            //默认启用
            _dep.enableFlag = true;
            if(!_dep){
                _dep = {};
            }
            if(!_dep.parentId || _dep.parentId == undefined){
                //如果没有选中任何机构，父级机构默认选中“无”
                _dep.parentId = "";
            }
            var result = eayunModal.dialog({
                title: '创建机构',
                width: '800px',
                templateUrl: 'controllers/department/edit.html',
                controller: 'DepartmentSaveCtrl',
                controllerAs: 'edit',
                resolve: {
                    department: _dep
                }
            });
            result.then(function () {

                DepartmentService.getTree().then(function (value) {
                    vm.menuTree = value;
                    //vm.itemClicked( vm.dep.parentId==null?value[0]: vm.dep.parentId);
                    DepartmentService.getDepartment(vm.dep.parentId).then(function (data) {
                        vm.department = data;
                    });
                });
            });
        };

        vm.edit = function ($event, department) {
            if(!department){
                department = {};
            }
            //如果当前选中机构没有parentId，则默认选中“无”
            if(!department.parentId || department.parentId == undefined){
                department.parentId = "";
            }
            var result = eayunModal.dialog({
                title: '编辑机构',
                width: '800px',
                templateUrl: 'controllers/department/edit.html',
                controller: 'DepartmentSaveCtrl',
                controllerAs: 'edit',
                resolve: {
                    department: department
                }
            });
            result.then(function () {
                DepartmentService.getDepartment( vm.dep.parentId).then(function (data) {
                    vm.department = data;
                    DepartmentService.getTree().then(function (value) {
                        vm.menuTree = value;
                        //vm.itemClicked( vm.dep.parentId==null?value[0]: vm.dep.parentId);
                    });
                });

            });
            $event.stopPropagation();
        };

        vm.delete = function ($event, department) {
            var promise;
            eayunModal.confirm('确定删除机构？').then(
                function() {
                    promise=DepartmentService.delete(department.id);
                    promise.then(function () {
                        toast.success('删除成功');
                        DepartmentService.getTree().then(function (data) {
                            vm.menuTree = data;
                            //vm.itemClicked(vm.dep.parentId==null?data[0]: vm.dep.parentId);
                            if(department.parentId && department.parentId != ""){
                                DepartmentService.getDepartment(department.parentId).then(function (data) {
                                    vm.department = data;
                                    vm.itemClicked(data);
                                });
                            }else{
                                vm.department = data[0];
                                vm.itemClicked(data[0]);
                            }
                        });
                    }, function (msg) {
                        eayunModal.warning(msg);
                    });
                    //$event.stopPropagation();
                });

        };
    }]);