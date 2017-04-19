/**
 * Created by cxy on 2016/3/24.
 */
'use strict';

angular.module('eayun.center')
    .controller('CenterDataCtrl',['CenterDataService','eayunModal','toast','$state','SysCode', function (CenterDataService,eayunModal,toast,$state,SysCode) {
        var dataCenter=this;
        dataCenter.myTable = {
            source: '/api/ecmc/physical/datacenter/querydatacenter',
            api: {},
            getParams: function () {
                return {
                    dcName : dataCenter.dcName
                };
            }
        };

        dataCenter.flushDC=function(dcId){
            CenterDataService.flushDC(dcId);
        };
        /**编辑*/
        dataCenter.editDC= function (dcId) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '编辑数据中心',
                width: '800px',
                templateUrl: 'controllers/center/edit/edit.html',
                controller: 'CenterEditCtrl',
                controllerAs:'dataCenter',
                resolve: {
                    model : function () {
                        return CenterDataService.getDCById(dcId).then(function (data) {
                            return data;
                        });
                    }
                }

            });
            result.then(function () {
                    dataCenter.myTable.api.draw();
            });
        };

        /**增加*/
        dataCenter.add= function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '添加数据中心',
                width: '800px',
                templateUrl: 'controllers/center/add/add.html',
                controller: 'CenterAddCtrl',
                controllerAs:'dataCenter'
            });
            result.then(function () {
                dataCenter.myTable.api.draw();
            });
        };

        /**删除*/
        dataCenter.deleteDC= function (dcId) {

            eayunModal.confirm('确定删除数据中心？').then(
                function() {
                    CenterDataService.checkDelete(dcId).then(function (data) {
                        if(data.data){
                            CenterDataService.deleteDC(dcId).then(function () {
                                dataCenter.myTable.api.draw();
                            });
                        }else{
                            eayunModal.warning(data.message);
                        }
                    });
                });
        };
        /**详情*/
        dataCenter.detail= function (dcId) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '数据中心详情',
                width: '1000px',
                templateUrl: 'controllers/center/detail/detail.html',
                controller:'CenterDetailCtrl',
                controllerAs:'detail',
                resolve:{
                    model:function () {
                        return CenterDataService.getDetail(dcId);
                    }
                }
            });
        };
        dataCenter.doSearch= function () {
            dataCenter.myTable.api.draw();
        }
    }]);