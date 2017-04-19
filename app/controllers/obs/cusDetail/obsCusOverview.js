/**
 * Created by cxy on 2016/3/25.
 */
'use strict';

angular.module('eayun.obs')
    .controller('ObsCusOverviewCtrl', ['ObsService','$stateParams','eayunModal','obsCustomers', function (ObsService,$stateParams,eayunModal,obsCustomers) {
        var obsCusOverview=this;
        /**获取全部obs用户*/
        obsCusOverview.cus=obsCustomers;
        if(obsCustomers!=null&&obsCustomers.length>0) {
            obsCusOverview.obsUser = obsCustomers[0].cusId;
            if ($stateParams.cusId != null && $stateParams.cusId.length > 0) {
                obsCusOverview.obsUser = $stateParams.cusId;
            }
            ObsService.getObsInMonthUsed(obsCustomers[0].cusId).then(function (data) {
                obsCusOverview.usedInMonth=data;
            });
            ObsService.getBucketList(obsCusOverview.obsUser).then(function (data) {
                obsCusOverview.buckets=data;
                if(data!=null&&data.length>0){
                    obsCusOverview.bucketName=data[0].bucketName;
                    if ($stateParams.bucketName != null && $stateParams.bucketName.length > 0) {
                        obsCusOverview.selectModel=$stateParams.type;
                        obsCusOverview.bucketName = $stateParams.bucketName;
                        obsCusOverview.getChart(obsCusOverview.obsUser,obsCusOverview.bucketName,obsCusOverview.selectModel,obsCusOverview.startDate,obsCusOverview.endDate);
                        obsCusOverview.getUsedInMonth(obsCusOverview.obsUser);
                        obsCusOverview.obsUsedTable = {
                            source: '/api/ecmc/obs/obscustomer/getObsResources',
                            api: {},
                            getParams: function () {
                                return {
                                    cusId : obsCusOverview.obsUser,
                                    bucketName : obsCusOverview.bucketName,
                                    startDate: obsCusOverview.startDate.getTime(),
                                    endDate: obsCusOverview.endDate.getTime()
                                };
                            }
                        };
                    }
                }
            });
            obsCusOverview.obsHistoryTable={
                source: '/api/ecmc/obs/obscustomer/getObsHistoryResources',
                api: {},
                getParams: function () {
                    return {
                        cusId : obsCusOverview.obsUser
                    };
                }
            };
        }
        /**获取客户下所有的bucket*/
        obsCusOverview.getBucketList= function (cusId) {
            ObsService.getBucketList(cusId).then(function (data) {
                obsCusOverview.buckets=data;
                if(data!=null&&data.length>0){
                    obsCusOverview.bucketName=data[0].bucketName;
                    //console.info(data[0].bucketName);
                    if ($stateParams.buckeName != null && $stateParams.buckeName.length > 0) {
                        obsCusOverview.obsBucketName = $stateParams.buckeName;
                    }
                }else{
                    obsCusOverview.buckets=[];
                    obsCusOverview.bucketName=null;
                }
            });

        };
        obsCusOverview.change= function () {
            obsCusOverview.show=false;
            obsCusOverview.myChart.clear();
        };
        /**获取本月使用量*/
        obsCusOverview.getUsedInMonth= function (cusId) {
            ObsService.getObsInMonthUsed(cusId).then(function (data) {
                obsCusOverview.usedInMonth=data;
            });
        };
        /**初始化查询类别下拉框*/
        obsCusOverview.selectModel='storage';
        /**初始化查询时间*/
        var date=new Date();
        obsCusOverview.startDate=new Date(date.getTime()-6 * 24 * 3600 * 1000);
        obsCusOverview.endDate=date;
        /**初始化echarts图不显示*/
        obsCusOverview.show=false;
        /**查询*/
        obsCusOverview.query= function () {
            if(ObsService.checkQuery(obsCusOverview.obsUser,obsCusOverview.bucketName,obsCusOverview.selectModel,obsCusOverview.startDate,obsCusOverview.endDate)){
                obsCusOverview.getChart(obsCusOverview.obsUser,obsCusOverview.bucketName,obsCusOverview.selectModel,obsCusOverview.startDate,obsCusOverview.endDate);
                if(obsCusOverview.obsUsedTable.source!=null&&obsCusOverview.obsUsedTable.source.length>0){
                    obsCusOverview.obsUsedTable.api.draw();
                }else{
                    obsCusOverview.obsUsedTable = {
                        source: '/api/ecmc/obs/obscustomer/getObsResources',
                        api: {},
                        getParams: function () {
                            return {
                                cusId : obsCusOverview.obsUser,
                                bucketName : obsCusOverview.bucketName,
                                startDate: obsCusOverview.startDate.getTime(),
                                endDate: obsCusOverview.endDate.getTime()
                            };
                        }
                    };
                }
            }
        };

        /**改变客户下拉框*/
        obsCusOverview.changeCus= function (cusId) {
            obsCusOverview.getBucketList(cusId);
            obsCusOverview.getUsedInMonth(cusId);
            obsCusOverview.obsHistoryTable.api.draw();
            obsCusOverview.change();
        };
        obsCusOverview.changeType= function () {
            if(ObsService.checkSelect(obsCusOverview.obsUser,obsCusOverview.bucketName,obsCusOverview.selectModel,obsCusOverview.startDate,obsCusOverview.endDate)&&obsCusOverview.show){
                obsCusOverview.query();
            }
        };
        /**echarts*/
        obsCusOverview.getChart= function (cusId,bucketName,type,startDate,endDate) {
            obsCusOverview.show=true;
            ObsService.getCusChart(cusId,bucketName,type,startDate,endDate).then(function (data) {
                obsCusOverview.myChart.clear();
                var option=ObsService.getOption(data,'user');
                obsCusOverview.myChart.setOption(option);
                window.onresize = obsCusOverview.myChart.resize;
            });

        };
        /**设置配额*/
        obsCusOverview.set= function (cusId) {
            if(ObsService.checkCusId(cusId)){
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '配额设置',
                    width: '600px',
                    templateUrl: 'controllers/obs/cusDetail/set/set.html',
                    controller: 'setObsQuotaCtrl',
                    controllerAs:'quota',
                    resolve: {
                        cusId : function () {
                            return cusId;
                        }
                    }
                });
                result.then(function (model) {
                    ObsService.setQuota(cusId,model);
                });
            }
        };
    }]);