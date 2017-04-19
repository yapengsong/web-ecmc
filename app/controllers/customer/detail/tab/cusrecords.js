/**
 * Created by Administrator on 2016/8/19 0019.
 */
angular.module('eayun.customer')
    .controller('CusRecordCtrl', ['eayunModal', '$state', 'CustomerService', '$stateParams', '$http',
        function (eayunModal, $state, CustomerService, $stateParams, $http) {
            var that = this;
            var firstDate = new Date();
            firstDate.setDate(1); //第一天
            firstDate.setHours(0, 0, 0, 0);
            var end=new Date();
            end.setHours(0, 0, 0, 0);
            that.cusId = $stateParams.cusId;
            that.time={
                beginTime:firstDate,
                endTime:end
            };
            that.incomeType='';
            that.status = [
                {value: '', text: '收支类型（全部）'},
                {value: 1, text: '收入'},//如不指定，默认选中第一项
                {value: 2, text: '支出'}];
            that.changeStatus = function () {
                that.myTable.api.draw();
            };
            that.myTable = {
                source: '/api/ecmc/customer/getcusrecords',
                api:{},
                getParams: function () {
                    return {
                        incomeType:that.incomeType,
                        beginTime : that.time.beginTime?that.time.beginTime.getTime(): '',
                        endTime : that.time.endTime ? that.time.endTime.getTime() + 86400000  : '',
                        cusId : that.cusId
                    };
                }
            };
            that.query=function(){
                that.myTable.api.draw();
            }
            /**导出事件*/
            that.createExcel = function () {
                if(that.time.beginTime==null&&that.time.endTime==null){
                    eayunModal.error("请选择时间范围");
                    return;
                }
                if(that.time.beginTime==null){
                    eayunModal.error("请选择开始时间");
                    return;
                }
                if(that.time.endTime==null){
                    eayunModal.error("请选择截止时间");
                    return;
                }
                that.myTable.api.draw();
                that.createdata = {
                    beginTime : that.time.beginTime?that.time.beginTime.getTime(): '',
                    endTime : that.time.endTime ? that.time.endTime.getTime() + 86400000  : ''
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
                $("#record-export-iframe").attr("src", "/api/ecmc/customer/createrecordexcel.do?beginTime="+that.createdata.beginTime+
                    "&endTime="+that.createdata.endTime+"&incomeType="+that.incomeType+"&browser="+browser+"&cusId="+that.cusId);
            };
        }]);