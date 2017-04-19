/**
 * Created by eayun on 2016/4/9.
 */
'use strict'

angular.module('eayun.menu')
    .controller('MenuEditCtrl', ['MenuService', 'menu', '$scope', 'eayunModal','toast',
        function (MenuService, _menu, $scope, eayunModal,toast) {
            var vm = this;
            vm.menu = angular.copy(_menu,{});
            MenuService.getTree().then(function (data) {
                if(data && data instanceof Array){
                    data.unshift({"id":"", "name":"无"});
                }
                vm.tree = data;
                //如果是编辑，不允许选择当前菜单及其子菜单
                if(_menu && _menu.id){
                    vm.removeSelf(vm.tree, _menu);
                }
            });
            vm.removeSelf = function(data,menu){
                for(var i in data){
                    var m = data[i];
                    if(m.id == menu.id){
                        data.splice(i, 1);
                    }else{
                        if(m.children && m.children.length > 0){
                            vm.removeSelf(m.children,menu);
                        }
                    }
                }

            }
            $scope.commit = function () {
                var promise;
                if (vm.menu.id) {
                    promise = MenuService.edit(vm.menu);
                } else {
                    promise = MenuService.add(vm.menu);
                }
                promise.then(function (data) {
                    toast.success('保存成功');
                    $scope.ok(data);
                }, function (msg) {
                    eayunModal.error(msg);
                });
            };
        }]);