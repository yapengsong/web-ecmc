/**
 * Created by eayun on 2016/4/9.
 */
'use strict'

angular.module('eayun.menu')
    .service('MenuService', ['$http', 'SysCode', '$q', function ($http, SysCode, $q) {
        var menuService = this;

        menuService.getTree = function () {
            return $http.post('/api/ecmc/system/menu/getmenutreegrid', {}).then(function (res) {
                return res.data;
            });
        };
        menuService.getMenuById = function (id) {
            return $http.post('/api/ecmc/system/menu/getmenubyid', {menuId:id}).then(function (res) {
                return res.data.data;
            });
        };
        menuService.add = function (menu) {
            return $http.post('/api/ecmc/system/menu/createmenu', menu || {}).then(function (response) {
                var deferred=$q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject(response.data.message);
                    case  SysCode.success:
                        deferred.resolve(menu);
                    default:
                        deferred.reject();
                }
                return deferred.promise;
            });
        };

        menuService.edit = function (menu) {
            return $http.post('/api/ecmc/system/menu/modifymenu', menu || {}).then(function (response) {
                var deferred=$q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject(response.data.message);
                    case  SysCode.success:
                        deferred.resolve(menu);
                    default:
                        deferred.reject();
                }
                return deferred.promise;
            });
        };
        menuService.checkDel= function (menuId) {
            return $http.post('/api/ecmc/system/menu/checkfordel',{menuId:menuId}).then(function (response) {
                return response.data;
            });
        };
        menuService.delete = function (menuId) {
            return $http.post('/api/ecmc/system/menu/deletemenu', {menuId: menuId}).then(function (response) {
                var deferred=$q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject(response.data.message);
                    case  SysCode.success:
                        deferred.resolve();
                    default:
                        deferred.reject();
                }
                return deferred.promise;
            });
        };
        //menuService.addMenu = function () {
        //    var result = eayunModal.dialog({
        //        showBtn: true,
        //        title: '创建菜单',
        //        width: '800px',
        //        templateUrl: 'controllers/menu/add/add.html',
        //        controller: 'MenuAddCtrl',
        //        resolve: {}
        //    });
        //    return result;
        //};
        //
        //menuService.editMenu = function () {
        //    var result = eayunModal.dialog({
        //        showBtn: true,
        //        title: '创建菜单',
        //        width: '800px',
        //        templateUrl: 'controllers/menu/add/add.html',
        //        controller: 'MenuAddCtrl',
        //        resolve: {}
        //    });
        //    return result;
        //};
        //
        //menuService.deleteMenu = function () {
        //    eayunModal.confirm('确定要删除菜单？').then(function(){
        //
        //    });
        //};
        //
        //return {
        //    addMenu: menuService.addMenu,
        //    editMenu: menuService.editMenu,
        //    deleteMenu: menuService.deleteMenu
        //}
    }])
    .factory('MenuDepartmentTree',[function(){
        var MenuDepartmentTree = {};
        var data = {
            treeData:[]
        };
        MenuDepartmentTree.setTreeData = function(_data){
            data.treeData = _data;
        };
        MenuDepartmentTree.getData = function(){
            return data;
        };
        return MenuDepartmentTree;
    }]);