/**
 * Created by ZHL on 2016/4/6.
 */
'use strict';

angular.module('eayun.quotatemp')
    .service('QuotaTemplateService', ['$http', 'SysCode', '$q', function ($http, SysCode, $q) {
        var quotaTemplateService = this;

        quotaTemplateService.getTemplateList = function(_item){
            return $http.post('/api/ecmc/quota/template/getquotatemplatelist',_item).then(function (response) {
                return response.data;
            });
        }

        quotaTemplateService.createTemplate = function(_template){
            return $http.post('/api/ecmc/quota/template/addquotatemplate',_template).then(function (response) {
                return response.data;
            });
        }

        quotaTemplateService.updateTemplate = function(_template){
            return $http.post('/api/ecmc/quota/template/modifyquotatemplate',_template).then(function (response) {
                return response.data;
            });
        }

        quotaTemplateService.deleteTemplate = function(_id){
            return $http.post('/api/ecmc/quota/template/delquotatemplate',{qtId: _id}).then(function (response) {
                return response.data;
            });
        }

        quotaTemplateService.checkQuotaTemplateName = function(_qtId, _qtName){
            return $http.post('/api/ecmc/quota/template/checkquotatemplatename',{qtId: _qtId, qtName: _qtName}).then(function (response) {
                if(response.data.respCode==SysCode.success && response.data.data == false){
                    return true;
                }else{
                    return false;
                }
            });
        }
    }]);