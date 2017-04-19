/**
 * Created by ZHL on 2016/4/5.
 */
'use strict';

angular.module('eayun.sysdatatree')
    .controller('SysDataTreeCtrl', ['eayunModal','sysdatatreeService','SysCode','toast',function (eayunModal,sysdatatreeService,SysCode,toast) {
        var vm = this;
        vm.nodeId ='';
        vm.nodeName = '';
        vm.parentId = '0';
        vm.route = 'app.sysdatatree.sysdatatree';
        vm.treeTable = {
            api: {},
            source: '/api/ecmc/system/enum/getdatatreelist',
            getParams: function () {
                    return{
                            nodeId : vm.nodeId,
                            nodeName : vm.nodeName,
                            parentId : vm.parentId
                    }
            }
        };
        vm.tree = [];
        vm.getTreeData = function(){
            sysdatatreeService.getTree().then(function(data){
                vm.tree = [];
                if(data.respCode == SysCode.success){
                    vm.tree.push(data.data);
                }
            });
        };
        vm.getTreeData();

        vm.itemClicked = function(item){
            item.$$isExpend = !item.$$isExpend;
            vm.parentId = item.nodeId;
            vm.treeTable.api.draw();
        }
        vm.query = function(){
                vm.treeTable.api.draw();
                vm.isAllChecked = false;
        };
        /**列表点击*/
        vm.nextQuery = function(item){
            var result = eayunModal.dialog({
                showBtn: false,
                title: '数据字典详情',
                width: '700px',
                templateUrl: 'controllers/sysdatatree/detail/detail.html',
                controller: 'DetailCtrl',
                controllerAs: 'detail',
                resolve: {
                    item: function(){
                        return item;
                    }
                }
            });
            result.then(function () {
            });
        };
        /**修改方法*/
        vm.edit = function(item){
            var result = eayunModal.dialog({
                showBtn: true,
                title: '修改数据字典',
                width: '800px',
                templateUrl: 'controllers/sysdatatree/edit/edit.html',
                controller: 'SysDataTreeEditCtrl',
                controllerAs: 'edit',
                resolve: {
                    item: function(){
                        return item;
                    }
                }
            });
            result.then(function (_item) {
                sysdatatreeService.edit(_item).then(function(data){
                    if(data.respCode == SysCode.success){
                        toast.success('数据字典修改成功');
                    }else{
                        eayunModal.error('数据字典修改失败');
                    }
                    vm.getTreeData();
                    vm.treeTable.api.draw();
                    vm.isAllChecked = false;
                });
            });
        };
        /**删除*/
        vm.delete = function(){
            vm.ids = '';
            angular.forEach(vm.treeTable.result, function (value,key) {
                if(value.isCheck){
                    vm.ids = vm.ids + value.nodeId + ',';
                }
            });
            if(vm.ids == ''){
                toast.error('请至少选择一个节点');
                return;
            }
            eayunModal.confirm('确定删除选中的数据字典吗？').then(function () {
                sysdatatreeService.delete(vm.ids).then(function(data){
                    if(data.respCode == SysCode.success){
                        toast.success('数据字典删除成功');
                    }else{
                        eayunModal.error('数据字典删除失败');
                    }
                    vm.getTreeData();
                    vm.treeTable.api.draw();
                    vm.isAllChecked = false;
                });
            });
        };
        /**添加*/
        vm.add = function(){
            var result = eayunModal.dialog({
                showBtn: true,
                title: '创建数据字典',
                width: '800px',
                templateUrl: 'controllers/sysdatatree/add/add.html',
                controller: 'SysDataTreeAddCtrl',
                controllerAs: 'add',
                resolve: {
                    parentId: function(){
                        return vm.parentId;
                    }
                }
            });
            result.then(function (_datatree) {
                sysdatatreeService.add(_datatree).then(function(data){
                    if(data.respCode == SysCode.success){
                        toast.success('数据字典添加成功');
                    }else{
                        eayunModal.error('数据字典添加失败');
                    }
                    vm.getTreeData();
                    vm.treeTable.api.draw();
                    vm.isAllChecked = false;
                });
            });
        };
        /**排序*/
        vm.sort = function(){
            var result = eayunModal.dialog({
                showBtn: false,
                title: '节点排序',
                width: '800px',
                templateUrl: 'controllers/sysdatatree/sort/sort.html',
                controller: 'SysDataTreeSortCtrl',
                controllerAs: 'sorttree',
                resolve: {
                    parentId: function(){
                        return vm.parentId;
                    }
                }
            });
            result.then(function () {
                vm.getTreeData();
                vm.treeTable.api.draw();
                vm.isAllChecked = false;
            });
        }
        /**单个按钮*/
        vm.isAllChecked = false;
        vm.getChecked= function () {
            vm.isAllChecked = true;
            angular.forEach(vm.treeTable.result, function (value,key) {
                if(!value.isCheck){
                    vm.isAllChecked = false;
                };
            });
        };
        /**全选（取消）按钮*/
        vm.checkAll= function () {
            angular.forEach(vm.treeTable.result, function (value,key) {
                value.isCheck = vm.isAllChecked;
            });
        };
    }]);