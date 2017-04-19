/**
 * Created by Administrator on 2016/8/18 0018.
 */

'use strict'

angular.module('eayun.customer')
    .controller('CusPostPaidCtrl', ['eayunModal', '$state', 'CustomerService', '$stateParams', '$http',
        function (eayunModal, $state, CustomerService, $stateParams, $http) {
            var that = this;
            that.cusId = $stateParams.cusId;
            //var list=eayunStorage.get('navLists');
            //list.length=0;
            //list.push({route:'app.costcenter.guidebar.report.prepayment',name:'费用中心'});
            that.searchType='2';
            that.productName='';
            that.resourceName='';

            var firstDate = new Date();
            firstDate.setDate(1); //第一天
            firstDate.setHours(0, 0, 0, 0);
            that.beginTime=firstDate;
            var end=new Date();
            end.setHours(0, 0, 0, 0);
            that.endTime=end;
            that.monMonth=end;		//等产品示例样式出来再做具体处理
            that.begin=that.beginTime;
            that.end=that.endTime;

            that.change=function(num){
                if(num=='1'){
                    var firstDate = new Date();
                    firstDate.setDate(1); //第一天
                    firstDate.setHours(0, 0, 0, 0);
                    that.beginTime=firstDate;
                    var end=new Date();
                    end.setHours(0, 0, 0, 0);
                    that.endTime=end;
                    that.begin=that.beginTime;
                    that.end=that.endTime;
                    that.maxDate=new Date();
                }else{
                    var end=new Date();
                    end.setHours(0, 0, 0, 0);
                    that.monMonth=end;
                }
            }

            that.myTable = {
                source: '/api/ecmc/customer/getcusreport',
                api:{},
                getParams: function () {
                    return {
                        type : '2',
                        searchType : that.searchType,
                        beginTime : that.beginTime?that.beginTime.getTime() : '',
                        endTime : that.endTime ? that.endTime.getTime() + 86400000  : '',
                        monMonth :  that.monMonth.getTime() || '',
                        productName :  that.productName || '',
                        resourceName : that.resourceName || '',
                        cusId : that.cusId
                    };
                }
            };
            var getTotalCost = function () {
                if(that.searchType == '2'){
                    if(that.beginTime==null&&that.endTime==null){
                        eayunModal.error("请选择时间范围");
                        return;
                    }
                    if(that.beginTime==null){
                        eayunModal.error("请选择开始时间");
                        return;
                    }
                    if(that.endTime==null){
                        eayunModal.error("请选择截止时间");
                        return;
                    }
                }

                if(that.monMonth==null && that.searchType == '1'){
                    eayunModal.error("请选择账期");
                    return;
                }
                $http.post("/api/ecmc/customer/gettotalcost", {
                    type: '2',
                    searchType: that.searchType,
                    beginTime: that.beginTime?that.beginTime.getTime() : '',
                    endTime: that.endTime ? that.endTime.getTime() + 86400000 : '',
                    monMonth: that.monMonth.getTime() || '',
                    productName: that.productName || '',
                    resourceName: that.resourceName || '',
                    cusId : that.cusId
                }).then(function (response) {
                    that.totalCost = response.data.totalCost;
                });
            }
            getTotalCost();
            that.queryReport=function(){
                if(that.searchType == '2'){
                    if(that.beginTime==null&&that.endTime==null){
                        eayunModal.error("请选择时间范围");
                        return;
                    }
                    if(that.beginTime==null){
                        eayunModal.error("请选择开始时间");
                        return;
                    }
                    if(that.endTime==null){
                        eayunModal.error("请选择截止时间");
                        return;
                    }
                }

                if(that.monMonth==null && that.searchType == '1'){
                    eayunModal.error("请选择账期");
                    return;
                }
                getTotalCost();
                that.myTable.api.draw();
                if(that.searchType=='1'){
                    //这里需要改成所选账期时间内
                    var first=that.monMonth;
                    first.setDate(1);
                    first.setHours(0, 0, 0, 0);
                    that.begin=first;
                    var date=new Date(first);
                    var now=new Date();
                    date.setDate(1);
                    date.setHours(0, 0, 0, 0);
                    var month=date.getMonth()+1;
                    if(now.getMonth()+1==month){
                        now.setHours(0, 0, 0, 0);
                        that.end=now;
                    }else{
                        date.setMonth(month)
                        that.end=new Date(date.getTime()-1000*60*60*24);
                    }
                }else{
                    that.begin=that.beginTime;
                    that.end=that.endTime;
                }
                console.info(that.begin+"--"+that.end);
            }
            /**导出事件*/
            that.createExcel = function () {
                if(that.searchType == '2'){
                    if(that.beginTime==null&&that.endTime==null){
                        eayunModal.error("请选择时间范围");
                        return;
                    }
                    if(that.beginTime==null){
                        eayunModal.error("请选择开始时间");
                        return;
                    }
                    if(that.endTime==null){
                        eayunModal.error("请选择截止时间");
                        return;
                    }
                }

                if(that.monMonth==null && that.searchType == '1'){
                    eayunModal.error("请选择账期");
                    return;
                }
                that.queryReport();
                that.createdata = {
                    type : '2',
                    searchType : that.searchType,
                    beginTime : that.begin ? that.begin.getTime() : '',
                    endTime : that.end ? that.end.getTime() + 86400000  : '',
                    monMonth :  that.monMonth.getTime() || '',
                    productName :  that.productName || '',
                    resourceName : that.resourceName || '',
                    cusId : that.cusId
                };
                var explorer =navigator.userAgent;
                var browser = 'ie';
                if (explorer.indexOf("MSIE") >= 0) {
                    browser="ie";
                }else if (explorer.indexOf("Firefox") >= 0) {
                    browser = "Firefox";
                }else if(explorer.indexOf("Chrome") >= 0){
                    browser="Chrome";
                }else if(explorer.indexOf("Opera") >= 0){
                    browser="Opera";
                }else if(explorer.indexOf("Safari") >= 0){
                    browser="Safari";
                }else if(explorer.indexOf("Netscape")>= 0) {
                    browser='Netscape';
                }
                $("#report-export-iframe").attr("src", "/api/ecmc/customer/createpostpaidexcel.do?type="+that.createdata.type+"&searchType="
                    +that.createdata.searchType+"&beginTime="+that.createdata.beginTime+"&endTime="+that.createdata.endTime+"&monMonth="
                    +that.createdata.monMonth+"&productName="+that.createdata.productName+"&resourceName="+that.createdata.resourceName+"&browser="+browser+"&cusId="+that.cusId);
            };

            that.detail=function(id){
                $state.go('app.customer.postpaidreportdetail',{cusId:that.cusId,"id":id}); // 跳转后的URL;
            }
        }]);
