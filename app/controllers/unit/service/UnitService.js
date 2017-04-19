/**
 * Created by Administrator on 2016/6/20 0020.
 */
/**
 * Created by cxy on 2016/3/24.
 */
'use strict';

angular.module('eayun.unit')
    .service('ServiceunitService', ['$http', 'toast', 'SysCode', 'eayunModal', '$q', function ($http, toast, SysCode, eayunModal, $q) {
        var unitlistService = {};


        unitlistService.getDcList= function () {
            return $http.post('/api/ecmc/physical/datacenter/getlistdatacenter',{}).then(function (response) {
                return response.data.data;
            });
        };
        unitlistService.getCount= function () {
            return $http.post('/api/ecmc/record/getecmcrecordcount',{}).then(function (response) {
                return response.data;
            });
        };


        unitlistService.getByIdOrchushen= function (id) {
            return $http.post('/api/ecmc/record/getrecordByid',{id:id}).then(function (response) {
                return response.data;
            });
        };


        unitlistService.updatestatus= function (id,state,state1) {
            return $http.post('/api/ecmc/record/updaterecordstatus',{id:id,state:state,state1:state1}).then(function (response) {
                return response.data;
            });
        };

        unitlistService.deleted= function (id) {
            return $http.post('/api/ecmc/record/deletedrecord',{id:id}).then(function (response) {
                return response.data;
            });
        };

        unitlistService.recordreturn= function (data) {
            return $http.post('/api/ecmc/record/recordreturn',{data:data}).then(function (response) {
                return response.data;
            });
        };
        unitlistService.checkdownzip= function (id) {
            return $http.post('/api/ecmc/record/checkdownzip',{id:id}).then(function (response) {
                return response.data;
            });
        };

        unitlistService.updatedetail= function (model) {
            return $http.post('/api/ecmc/record/updatedetail',{model:model}).then(function (response) {
                return response.data;
            });
        };

        unitlistService.updatedetailbyweb= function (model) {
            return $http.post('/api/ecmc/record/updatedetailbyweb',{model:model}).then(function (response) {
                return response.data;
            });
        };



        /******************增加************************/
        /**上一页*/
        unitlistService.goUp = function (pagenumber) {
            pagenumber--;
            if (pagenumber < 1) {
                pagenumber = 1;
            }
            return pagenumber;
        };
        /**下一页*/
        unitlistService.goDown = function (pagenumber) {
            pagenumber++;
            if (pagenumber > 3) {
                pagenumber = 3;
            }
            return pagenumber;
        };


        return unitlistService;
    }])

