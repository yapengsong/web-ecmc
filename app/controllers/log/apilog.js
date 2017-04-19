'use strict';

/**
 *   ui:sys_log_query;
     http:/ecmc/overview/getallprojectlist.do;
     http:/ecmc/system/log/getecmcloglist.do;
     http:/ecmc/system/log/getOperLog.do;
     http:/ecmc/system/log/getecscLogList.do;
     http:/ecmc/system/log/getecmcloglistbymongon.do;
     http:/ecmc/system/log/getOperLogFromMongo.do;
     http:/ecmc/system/log/getecscloglistbymongon.do;
     http:/ecmc/system/api/log/getListDemoData.do;

 Attention:在ECMC中调用的时候需要在路径前面加上/api,因为进行了路径转发操作。
 */

angular.module('eayun.log')
    .controller('LogApiCtrl', ['HomeCommonService', "ApiLogService", "eayunModal","$stateParams","toast", function (HomeCommonService, ApiLogService, eayunModal,$stateParams,toast) {
        var api = this ;
        api.queryObj = {} ;
        api.queryObj.operator = "" ;
        api.queryObj.status = "" ;

        //设置数据筛选的开始时间和结束时间
        api.queryObj.createEndTime   = new Date();
        api.queryObj.createStartTime = new Date(api.queryObj.createEndTime.getTime() - 7 * 24 * 3600 * 1000);

        if ($stateParams.startTime){
            api.queryObj.createStartTime = new Date(Number($stateParams.startTime));
        }
        if ($stateParams.endTime){
            api.queryObj.createEndTime = new Date(Number($stateParams.endTime));
        }
        if ($stateParams.cusId){
            api.queryObj.operator = $stateParams.cusId;
        }
        if ($stateParams.status){
            api.queryObj.status = $stateParams.status;
        }

        //获取所有的数据中心列表信息
        HomeCommonService.getDcList().then(function (data) {
            api.dcList = data ;
            api.dcList.push({
                "apiDcCode" : "-------",
                "id" : "-------"
            }) ;

        });
        //获取所有的客户名称信息
        ApiLogService.getCusUser().then(function(data){
            api.cusList = data.data ;
            api.cusList.push({
                "cusOrg" : "-------",
                "cusId" : "-------"
            });
        });

        ApiLogService.getListData().then(function(data){
            api.resource = data ;
        }) ;
        api.rowState = "成功" ;

        api.table = {
            source: '/api/ecmc/system/api/log/getloglist',
            api: {},
            getParams: function () {
                return {

                    createStartTime:  (api.queryObj.createStartTime?api.queryObj.createStartTime.getTime():null),
                    createEndTime:    (api.queryObj.createEndTime?api.queryObj.createEndTime.getTime():null),
                    apiName: api.queryObj.apiName,
                    region: api.queryObj.region,
                    resourceType: api.queryObj.resourceType,
                    operator:  api.queryObj.operator,
                    ip: api.queryObj.ip,
                    status :  api.queryObj.status,

                };
            }
        } ;

        /**
         * 点击执行查询的具体业务逻辑
         */
        api.doSearch = function () {
            if (!api.queryObj.createStartTime && !api.queryObj.createEndTime){
                eayunModal.error("请选择时间范围") ;
                return ;
            }
            if (api.queryObj.createStartTime && !api.queryObj.createEndTime){
                eayunModal.error("截止时间不能为空") ;
                return ;
            }
            if (!api.queryObj.createStartTime && api.queryObj.createEndTime){
                eayunModal.error("开始时间不能为空") ;
                return ;
            }
            if ((api.queryObj.createEndTime.getTime()-api.queryObj.createStartTime.getTime()) > 30 * 24 * 60 * 60 * 1000){
                eayunModal.error("时间范围不能大于30天") ;
                return ;
            }
            api.table.api.draw();
        };

        /**
         * 重置表单数据
         */
        api.doReset = function () {
            api.stateParam = {} ;
            for(var i in api.queryObj){
                api.queryObj[i] = "" ;
            }
            api.table.api.draw();
        };

        api.showDetail = function(req,res,version){
            var detailWindow = eayunModal.dialog({
                showBtn:false,
                title: '日志状态详情',
                width: '800px',
                templateUrl: 'controllers/log/apilogdetail.html',
                controller: 'ApiDetailController',
                controllerAs: 'apiDetailCtrl',
                resolve: {
                    apiDetail: function () {
                        return {
                            req: req,
                            res: res,
                            version : version
                        };
                    }
                }
            });
            detailWindow.then(function () {
            });
        }

        api.syntaxHighlight = function(json){
            if (typeof json != 'string') {
                json = JSON.stringify(json, undefined, 2);
            }
            json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
                var cls = 'apinumber';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'apikey';
                    } else {
                        cls = 'apistring';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'apiboolean';
                } else if (/null/.test(match)) {
                    cls = 'apinull';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        }
        api.demojson = api.syntaxHighlight({"name":"wlkfec","age":30});

        api.xxxxx = "asdasdasdasdasds" ;

        api.printQueryParams = function(){
            alert(JSON.stringify(api.queryObj)) ;
        }

        api.selectStateClass = function(state) {
            if (state == "成功"){
                return "apisuccess" ;
            }
            if (state == "失败"){
                return "apifailure" ;
            }
            if (state == "执行中"){
                return "apirunning" ;
            }
        }
        api.queryAPINamesByVersion = function(){
            //var version = api.queryObj.resourceType == undefined ? "" : api.queryObj.resourceType.split("/")[0];
            var type = api.queryObj.resourceType == undefined ? "" : api.queryObj.resourceType ;//.split("/")[1]
            ApiLogService.getApiNamesByVersion(type).then(function(data){
                api.queryObj.apiName = "" ;
                api.resource.allApiNames = data ;
                api.table.api.draw();
            });
        }

        api.allStatus = [{
            sName:"成功",
            sValue:"1"
        },{
            sName:"失败",
            sValue:"0"
        },{
            sName:"执行中",
            sValue:"2"
        }] ;

    }])
    .controller("ApiDetailController",["apiDetail", function(apiDetail){
        var ad = this ;
        ad.req = apiDetail.req ;
        ad.res = apiDetail.res ;
        ad.version = apiDetail.version ;
        ad.ioo = "iooioo" ;
        ad.syntaxHighlight = function(json){
            if (typeof json != 'string') {
                json = JSON.stringify(json, undefined, 2);
            }
            json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
                var cls = 'apinumber';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'apikey';
                    } else {
                        cls = 'apistring';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'apiboolean';
                } else if (/null/.test(match)) {
                    cls = 'apinull';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        }



        try {
            ad.resHTML = ad.syntaxHighlight(JSON.parse(ad.res)) ;
            ad.resIsHtml = true ;
        }catch (e){
            ad.resHTML = ad.res ;
            ad.resIsHtml = false ;
        }



        try {
            ad.reqHTML = ad.syntaxHighlight(JSON.parse(ad.req)) ;
            ad.reqIsHtml = true ;
        }catch (e){
            ad.reqHTML = ad.req ;
            ad.reqIsHtml = false ;
        }


        ad.changeObject = function(obj){
            var origin = {} ;
            for(var attr in obj){
                origin[attr] = obj[attr] ;
            }
            return origin ;
        }

        //ad.windowDetailIsShow = true;
        //ad.windowDetailIsShowResponse = true;

        ad.testHtml = "<font color='red'>wlkfec</font>" ;

    }]);