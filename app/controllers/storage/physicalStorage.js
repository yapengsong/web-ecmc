/**
 * Created by cxy on 2016/3/25.
 */
'use strict';

angular.module('eayun.storage')
    .controller('StoragePhysicalCtrl',['StoragePhysicalService','eayunModal','$stateParams', function (StoragePhysicalService,eayunModal,$stateParams) {
        var physicalStorage=this;
        var vm=this;
        /**表格*/
        physicalStorage.myTable={
            source: '/api/ecmc/physical/storage/queryDcStorage',
            api: {},
            getParams: function () {
                if(vm.dcId){
                    $stateParams.dcId=vm.dcId;
                }
                if(vm.dcId==''){

                    $stateParams.dcId=vm.dcId;
                }
                return {
                    dataCenterId: $stateParams.dcId,
                    storageName:physicalStorage.storageName
                };
            }
        };
        physicalStorage.doSearch= function () {
            physicalStorage.myTable.api.draw();
        };
        /**添加*/
        physicalStorage.add= function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '添加存储',
                width: '600px',
                templateUrl: 'controllers/storage/add/add.html',
                controller: 'StorageAddCtrl',
                controllerAs:'model'

            });
            result.then(function () {
                    physicalStorage.myTable.api.draw();
            });
        };
        /**编辑*/
        physicalStorage.edit= function (id) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '编辑存储',
                width: '600px',
                templateUrl: 'controllers/storage/edit/edit.html',
                controller: 'StorageEditCtrl',
                controllerAs:'model',
                resolve: {
                    model : function () {
                        return StoragePhysicalService.getStorage(id).then(function (data) {
                            return data;
                        });
                    }
                }
            });
            result.then(function (model) {
                StoragePhysicalService.editStorage(model).then(function () {
                    physicalStorage.myTable.api.draw();
                });
            });
        };
        /**详情*/
        physicalStorage.detail= function (id) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '存储详情',
                width: '1100px',
                templateUrl: 'controllers/storage/detail/detail.html',
                controller: 'StorageDetailCtrl',
                controllerAs:'detail',
                resolve: {
                    model: function () {
                        return StoragePhysicalService.getStorage(id).then(function (data) {
                            return data;
                        });
                    }
                }
            });
        };
        /**删除*/
        physicalStorage.delete= function (id) {
            eayunModal.confirm('确定删除存储？').then(
                function() {
                    StoragePhysicalService.deleteStorage(id).then(function () {
                        physicalStorage.myTable.api.draw();
                    });
                });
        };

        StoragePhysicalService.getDcList().then(function (data) {

            vm.dcList=data;
        });
    }]);
