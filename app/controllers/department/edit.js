/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.department')
    .controller('DepartmentSaveCtrl', ['$scope', 'department', 'DepartmentService', 'eayunModal','toast',
        function ($scope, _department, DepartmentService, eayunModal,toast) {
            var vm = this;
            vm.department=angular.copy(_department, {});
            DepartmentService.getTree().then(function (tree) {
                if(tree && tree instanceof Array){
                    tree.unshift({"id":"", "name":"无"});
                }
                vm.tree = tree;
                //如果是编辑，不允许选择当前机构及其子机构
                if(_department && _department.id){
                    vm.removeSelf(vm.tree, _department);
                }
            });
            vm.removeSelf = function(data,_department){
                for(var i in data){
                    var m = data[i];
                    if(m.id == _department.id){
                        data.splice(i, 1);
                    }else{
                        if(m.children && m.children.length > 0){
                            vm.removeSelf(m.children,_department);
                        }
                    }
                }
            }
            vm.checkDepartCode = function(value){
                return DepartmentService.checkDepartCode(value, vm.department.id);
            };
            $scope.commit = function () {
                var promise;
                if (vm.department.id) {
                    promise = DepartmentService.edit(vm.department);
                } else {
                    promise = DepartmentService.add(vm.department);
                }
                promise.then(function (data) {
                    toast.success('操作成功');
                    $scope.ok(data);
                }, function (msg) {
                    eayunModal.error(msg);
                });
            };
            
        }]);