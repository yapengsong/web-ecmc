/**
 * Created by Administrator on 2016/8/18 0018.
 */

'use strict'

angular.module('eayun.customer')
    .controller('CusPrePaidCtrl', ['eayunModal', '$state', '$stateParams', '$http',
        function (eayunModal, $state, $stateParams, $http) {
            var that = this;
            that.cusId = $stateParams.cusId;
            //var list=eayunStorage.get('navLists');
            //list.length=0;
            //list.push({route:'app.costcenter.guidebar.report.prepayment',name:'费用中心'});
            that.productName = '';
            var firstDate = new Date();
            firstDate.setDate(1); //第一天
            firstDate.setHours(0, 0, 0, 0);
            that.beginTime = firstDate;
            var end = new Date();
            end.setHours(0, 0, 0, 0);
            that.endTime = end;
            that.begin = that.beginTime;
            that.end = that.endTime;
            that.myTable = {
                source: '/api/ecmc/customer/getcusreport',
                api: {},
                getParams: function () {
                    return {
                        type: '1',
                        beginTime: that.beginTime.getTime() || '',
                        endTime: that.endTime ? that.endTime.getTime() + 86400000 : '',
                        productName: that.productName || '',
                        cusId: that.cusId
                    };
                }
            };
            var getTotalCost = function () {
                if (that.beginTime == null && that.endTime == null) {
                    eayunModal.error("请选择时间范围");
                    return;
                }
                if (that.beginTime == null) {
                    eayunModal.error("请选择开始时间");
                    return;
                }
                if (that.endTime == null) {
                    eayunModal.error("请选择截止时间");
                    return;
                }
                $http.post("/api/ecmc/customer/gettotalcost", {
                    type: '1',
                    beginTime: that.beginTime.getTime() || '',
                    endTime: that.endTime ? that.endTime.getTime() + 86400000 : '',
                    productName: that.productName || '',
                    cusId: that.cusId
                }).then(function (response) {
                    that.totalCost = response.data.totalCost;
                });
            }
            getTotalCost();
            that.queryReport = function () {
                if (that.beginTime == null && that.endTime == null) {
                    eayunModal.error("请选择时间范围");
                    return;
                }
                if (that.beginTime == null) {
                    eayunModal.error("请选择开始时间");
                    return;
                }
                if (that.endTime == null) {
                    eayunModal.error("请选择截止时间");
                    return;
                }
                getTotalCost();
                that.myTable.api.draw();
                that.begin = that.beginTime;
                that.end = that.endTime;
            }
            /**导出事件*/
            that.createExcel = function () {
                if (that.beginTime == null && that.endTime == null) {
                    eayunModal.error("请选择时间范围");
                    return;
                }
                if (that.beginTime == null) {
                    eayunModal.error("请选择开始时间");
                    return;
                }
                if (that.endTime == null) {
                    eayunModal.error("请选择截止时间");
                    return;
                }
                getTotalCost();
                that.myTable.api.draw();
                that.createdata = {
                    type: '1',
                    beginTime: that.beginTime.getTime() || '',
                    endTime: that.endTime ? that.endTime.getTime() + 86400000 : '',
                    productName: that.productName || '',
                    cusId: that.cusId
                };
                var explorer = navigator.userAgent;
                var browser = 'ie';
                if (explorer.indexOf("MSIE") >= 0) {
                    browser = "ie";
                } else if (explorer.indexOf("Firefox") >= 0) {
                    browser = "Firefox";
                } else if (explorer.indexOf("Chrome") >= 0) {
                    browser = "Chrome";
                } else if (explorer.indexOf("Opera") >= 0) {
                    browser = "Opera";
                } else if (explorer.indexOf("Safari") >= 0) {
                    browser = "Safari";
                } else if (explorer.indexOf("Netscape") >= 0) {
                    browser = 'Netscape';
                }
                $("#report-export-iframe").attr("src", "/api/ecmc/customer/createprepaidexcel.do?type=" + that.createdata.type +
                    "&beginTime=" + that.createdata.beginTime + "&endTime=" + that.createdata.endTime +
                    "&productName=" + that.createdata.productName + "&browser=" + browser + "&cusId=" + that.cusId);
            };
            that.detail = function (orderNo) {
                $state.go('app.customer.prepaidreportdetail', {cusId:that.cusId, "orderNo": orderNo}); // 跳转后的URL;
            }

        }]);