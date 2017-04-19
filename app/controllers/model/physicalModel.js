/**
 * Created by cxy on 2016/3/25.
 */
'use strict';

angular.module('eayun.model')
    .controller('ModelPhysicalCtrl',['ModelPhysicalService','eayunModal', function (ModelPhysicalService,eayunModal) {
        var physicalModel=this;
        physicalModel.myTable={
            source: '/api/ecmc/physical/servermodel/querylist',
            api: {},
            getParams: function () {
                return {
                    serverName:physicalModel.serverName
                };
            }
        };
        physicalModel.doSearch= function () {
            physicalModel.myTable.api.draw();
        };
        /**添加*/
        physicalModel.add= function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '添加型号',
                width: '600px',
                templateUrl: 'controllers/model/add/add.html',
                controller: 'ModelAddCtrl',
                controllerAs:'model'

            });
            result.then(function (model) {
                ModelPhysicalService.addModel(model).then(function () {
                    physicalModel.myTable.api.draw();
                });
            });
        };
        /**编辑*/
        physicalModel.editModel= function (id) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '编辑型号',
                width: '600px',
                templateUrl: 'controllers/model/edit/edit.html',
                controller: 'ModelEditCtrl',
                controllerAs:'model',
                resolve:{
                    model : function () {
                        return ModelPhysicalService.getModel(id).then(function (data) {
                            return data;
                        });
                    }
                }
            });
            result.then(function (model) {
                ModelPhysicalService.editModel(model).then(function () {
                    physicalModel.myTable.api.draw();
                });
            });
        };

        /**详情*/
        physicalModel.detail= function (id) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '服务器型号详情',
                width: '1000px',
                templateUrl: 'controllers/model/detail/detail.html',
                controller: 'ModelDetailCtrl',
                controllerAs:'detail',
                resolve: {
                    model : function () {
                        return ModelPhysicalService.getModel(id).then(function (data) {
                            return data;
                        });
                    }
                }
            });
        };


        physicalModel.deleteModel= function (id) {
            eayunModal.confirm('确定删除服务器型号吗？').then(
                function() {
                    ModelPhysicalService.checkDelete(id).then(function (data) {

                        if(data){
                            ModelPhysicalService.deleteModel(id).then(function () {
                                physicalModel.myTable.api.draw();
                            });
                        }else{
                            eayunModal.info('该服务器型号已经使用，不能删除');
                        }
                    });


                });
        }
    }]);