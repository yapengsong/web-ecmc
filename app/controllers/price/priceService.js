/**
 * Created by ZHL on 2016/4/6.
 */
'use strict';

angular.module('eayun.price')
    .service('priceService', ['$http', 'SysCode', '$q', function ($http, SysCode, $q) {
        var priceService = this;
        priceService.getAllTypes = function () {
            return $http.post('/api/billing/factor/getallresourcestype',{}).then(function (response) {
                return response.data;
            });
        };
        priceService.getPricesByPayType = function (_item) {
            return $http.post('/api/billing/factor/getpricesbypaytype',_item).then(function (response) {
                return response.data;
            });
        };
        priceService.addFactorPrice = function (_item) {
            return $http.post('/api/billing/factor/addfactorprice',_item).then(function (response) {
                return response.data;
            });
        };
        priceService.editFactorPrice = function (_item) {
            return $http.post('/api/billing/factor/editfactorprice',_item).then(function (response) {
                return response.data;
            });
        };
        priceService.deleteFactorPrice = function (_item) {
            return $http.post('/api/billing/factor/deletefactorprice',_item).then(function (response) {
                return response.data;
            });
        };
    }]);