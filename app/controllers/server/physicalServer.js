/**
 * Created by cxy on 2016/3/24.
 */
'use strict';

angular.module('eayun.server')
    .controller('ServerPhysicalCtrl',['ServerPhysicalService','eayunModal','$stateParams', function (ServerPhysicalService,eayunModal,$stateParams) {
        var physicalServer=this;
       var  vm=this;
        physicalServer.myTable = {
            source: '/api/ecmc/physical/server/queryserver',
            api: {},
            getParams: function () {
                if(vm.dcId){
                    $stateParams.dcId=vm.dcId;
                }
                if(vm.dcId==''){

                    $stateParams.dcId=vm.dcId;
                }
                return {
                    dataCenterId : $stateParams.dcId,

                    anyName:physicalServer.serverName,
                    type:physicalServer.type
                };
            }
        };
        physicalServer.doSearch= function () {
            physicalServer.myTable.api.draw();
        };
        /**编辑服务器*/
        physicalServer.editServer=function(id){
            var result = eayunModal.dialog({
                showBtn: false,
                title: '编辑服务器',
                width: '600px',
                templateUrl: 'controllers/server/edit/edit.html',
                controller: 'ServerEditCtrl',
                controllerAs:'model',
                resolve: {
                    model : function () {
                        return ServerPhysicalService.getServer(id).then(function (data) {
                            return data;
                        });
                    }
                }

            });
            result.then(function (model) {
                model.isMonitor=model.isMonitor==true?'1':'0';
                ServerPhysicalService.edit(model).then(function () {
                    physicalServer.myTable.api.draw();
                });
            });
        };
        /**增加服务器*/
        physicalServer.addServer= function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '添加服务器',
                width: '600px',
                templateUrl: 'controllers/server/add/add.html',
                controller: 'ServerAddCtrl',
                controllerAs:'model'

            });
            result.then(function (model) {
                model.isMonitor=model.isMonitor==true?'1':'0';
                ServerPhysicalService.add(model).then(function () {
                    physicalServer.myTable.api.draw();
                });
            });
        };
        /**服务器详情*/
        physicalServer.detail= function (id) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '服务器详情',
                width: '1100px',
                templateUrl: 'controllers/server/detail/detail.html',
                controller: 'ServerDetailCtrl',
                controllerAs:'detail',
                resolve: {
                    model : function () {
                        return ServerPhysicalService.getServer(id).then(function (data) {
                            return data;
                        });
                        //return {};
                    }
                }

            });
        };
        ServerPhysicalService.getDcList().then(function (data) {

          vm.dcList=data;
        });
        physicalServer.deleteServer=function(ids){
            eayunModal.confirm('确定删除服务器吗？').then(function(){

                ServerPhysicalService.deleteServer(ids).then(function () {
                    physicalServer.myTable.api.draw();
                });

            })


        };

    }]);