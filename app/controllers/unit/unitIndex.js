/**
 * Created by chenglong on 2016/6/20 0020.
 */
'use strict';

angular.module('eayun.unit')
    .controller('unitListCtrl', ['ServiceunitService', 'eayunModal', 'toast', '$state', 'SysCode',
        function (ServiceunitService, eayunModal, toast, $state, SysCode) {
            var unitlist = this;




            unitlist.myTable = {

                source: '/api/ecmc/record/getecmcrecordlist',
                api: {},
                getParams: function () {

                    return{
                        queryName : unitlist.queryName,
                        state:unitlist.state,
                        recordType:unitlist.recordType,
                        dcId:unitlist.dcId
                    }
                }
            };





            ServiceunitService.getDcList().then(function (data) {
                unitlist.dcResourceList = data;
            });

            ServiceunitService.getCount().then(function (data) {
                unitlist.recorCount = data;

            });



            unitlist.doSearch = function () {

                unitlist.myTable.api.draw();
                ServiceunitService.getCount().then(function (data) {
                    unitlist.recorCount = data;

                });
            };


            unitlist.querystatus=function(recordType,state,data){
                if(data!=0){
                    unitlist.queryName=undefined;
                unitlist.state=state;
                unitlist.recordType=recordType;
                unitlist.myTable.api.draw();
                ServiceunitService.getCount().then(function (data) {
                    unitlist.recorCount = data;

                });
                }
            };

            //初审
            unitlist.detail=function(id,unitid){

                if(unitid!=''&&unitid!=undefined){
                    var result = eayunModal.dialog({
                    showBtn: false,
                    title: '备案详情',
                    width: '1200px',
                    templateUrl: 'controllers/unit/detail/unitDetail.html',
                    controller: 'nounitDetailCtrl',
                    controllerAs:'unitdetail',
                    resolve: {
                        model : function () {
                            return ServiceunitService.getByIdOrchushen(id).then(function (data) {

                                return data;
                            });
                        }
                    }

                });
                    result.then(function (data) {

                        if(data.respCode='000000'){
                            toast.success('审批成功');
                        }else{
                            toast.success('审批失败');
                        }


                    },function(){
                        unitlist.myTable.api.draw();
                        ServiceunitService.getCount().then(function (data) {
                            unitlist.recorCount = data;

                        });
                    })
                    ;}

            };







            //初审
            unitlist.chushen=function(id){


                    var result = eayunModal.dialog({
                        showBtn: false,
                        title: '备案详情',
                        width: '1200px',
                        templateUrl: 'controllers/unit/chushendetail/unitDetail.html',
                        controller: 'unitDetailCtrl',
                        controllerAs:'unitdetail',
                        resolve: {
                            model : function () {
                                return ServiceunitService.getByIdOrchushen(id).then(function (data) {

                                    return data;
                                });
                            }
                        }

                    });
                    result.then(function (data) {

                        //if(data.respCode='000000'){
                        //    toast.success('审批成功');
                        //}else{
                        //    toast.success('审批失败');
                        //}

                        unitlist.myTable.api.draw();
                        ServiceunitService.getCount().then(function (data) {
                            unitlist.recorCount = data;

                        });
                    });
                };


            //复审
            unitlist.fushen=function(id){

                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '',
                    width: '1050px',
                    templateUrl: 'controllers/unit/fushen/fushendetail.html',
                    controller: 'unitfushenDetailCtrl',
                    controllerAs:'unitdetail',
                    resolve: {
                        model : function () {
                            return ServiceunitService.getByIdOrchushen(id).then(function (data) {

                                return data;
                            });
                        }
                    }

                });
                result.then(function (data) {

                    //if(data.respCode='000000'){
                    //    toast.success('审批成功');
                    //}else{
                    //    toast.success('审批失败');
                    //}

                    unitlist.myTable.api.draw();
                    ServiceunitService.getCount().then(function (data) {
                        unitlist.recorCount = data;

                    });
                });


            }
            //上报管局
            unitlist.upguanju=function(id){

                eayunModal.confirm('请确认上报管局操作？').then(
                    function() {
                        ServiceunitService.updatestatus(id,6).then(function (data) {
                            //if(data.respCode='000000'){
                            //    toast.success('审批成功');
                            //}else{
                            //    toast.success('审批失败');
                            //
                            //}
                            unitlist.myTable.api.draw();
                            ServiceunitService.getCount().then(function (data) {
                                unitlist.recorCount = data;
                            });
                        });
                    });

            }
            //删除
            unitlist.delete=function(id,unit){
                    console.info(unit);

                    eayunModal.confirm('请确认删除操作？').then(
                        function() {
                            ServiceunitService.deleted(id).then(function (data) {

                               if(unitlist.queryName==undefined&& unitlist.queryName==''){

                                   unitlist.myTable.api.draw();
                               }
                                        if(data.respCode='000000'){
                                            toast.success('删除成功');
                                            unit.$$active=true;
                                        }else{
                                            toast.success('删除失败');

                                        }
                                ServiceunitService.getCount().then(function (data) {
                                    unitlist.recorCount = data;
                                });
                            });
                        });

                }
            //管局结果
            unitlist.guanjujieguo=function(id){


                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '管局结果',
                    width: '1200px',
                    templateUrl: 'controllers/unit/guanjureturn/guanjureturn.html',
                    controller: 'guanjureturnCtrl',
                    controllerAs:'returnguanju',
                    resolve: {
                        model : function () {
                            return ServiceunitService.getByIdOrchushen(id).then(function (data) {

                                return data;
                            });
                        }
                    }

                });
                result.then(function (data) {
                    ServiceunitService.recordreturn(data).then(function (data) {
                        //if(data.respCode='000000'){
                        //    toast.success('审批成功');
                        //}else{
                        //    toast.success('审批失败');
                        //}
                        unitlist.myTable.api.draw();
                        ServiceunitService.getCount().then(function (data) {
                            unitlist.recorCount = data;

                        });

                    });


                });




            }


        }]);