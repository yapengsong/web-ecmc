/**
 * Created by cxy on 2016/3/24.
 */
'use strict';

angular.module('eayun.cabinet')
    .controller('CabinetPhysicalCtrl',['CabinetPhysicalService','eayunModal','toast','$stateParams','SysCode', function (CabinetPhysicalService,eayunModal,toast,$stateParams,SysCode) {
        var vm=this;
        vm.myTable={
            source: '/api/ecmc/physical/cabinet/querycabinet',
            api: {},


            getParams: function () {
                console.info( $stateParams.dcId);
                if(vm.dcId){

                    $stateParams.dcId=vm.dcId;
                }
                if(vm.dcId==''){

                    $stateParams.dcId=vm.dcId;
                }
                return {
                    dataCenterId : $stateParams.dcId==''?undefined:$stateParams.dcId,

                    cabinetName:vm.cabinetName
                };
            }
        };
        vm.doSearch= function () {
            vm.myTable.api.draw();
        };
        /**添加*/
        vm.add= function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '添加机柜',
                width: '600px',
                templateUrl: 'controllers/cabinet/add/add.html',
                controller: 'CabinetAddCtrl',
                controllerAs:'model'

            });
            result.then(function (model) {
                CabinetPhysicalService.add(model).then(function () {
                    vm.myTable.api.draw();
                });
            });
        };
        /**编辑*/
        vm.edit= function (id) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '编辑机柜',
                width: '600px',
                templateUrl: 'controllers/cabinet/edit/edit.html',
                controller: 'CabinetEditCtrl',
                controllerAs:'model',
                resolve: {
                    model : function () {
                        return CabinetPhysicalService.getCabinetById(id).then(function (data) {
                            return data;
                        });
                    }
                }
            });
            result.then(function (model) {
                CabinetPhysicalService.edit(model).then(function () {
                    vm.myTable.api.draw();
                });
            });
        };
        /**详情*/
        vm.detail= function (id,dcId) {

            var result = eayunModal.dialog({
                showBtn: false,
                title: '机柜详情',
                width: '1000px',
                templateUrl: 'controllers/cabinet/detail/detail.html',
                controller: 'CabinetDetailCtrl',
                controllerAs:'model',
                resolve: {
                    cabinetId: function () {
                        return id;
                    },
                    datacenterId: function () {
                        return dcId;
                    }
                }
            });
        };
        /**删除*/
        vm.delete= function (cabinetId,datecenterId) {
            eayunModal.confirm('确定删除机柜？').then(
                function() {
                    CabinetPhysicalService.deleteCabinet(cabinetId,datecenterId).then(function (data) {
                        if(data.respCode==SysCode.success){
                            toast.success('删除机柜成功!');
                            vm.myTable.api.draw();
                        }else{
                            eayunModal.info(data.message);
                        }

                    });
                });
        };

        CabinetPhysicalService.getDataCenter().then(function (data) {

            vm.dcList=data;
        });
    }]);