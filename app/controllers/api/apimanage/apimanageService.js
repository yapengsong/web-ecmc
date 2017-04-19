/**
 * Created by cxy on 2016/3/24.
 */
'use strict';

angular.module('eayun.api')
    .service('ApimanageService', ['$http','toast','SysCode','eayunModal','$q', function ($http,toast,SysCode,eayunModal,$q) {
        var apimanageService = this;
        apimanageService.getApiSwitchPhone = function(){
            return $http.post('/api/ecmc/api/switch/getapiswitchphone',{}).then(function (response) {
                return response.data;
            });
        };
        apimanageService.sendCode = function(_item){
            return $http.post('/api/ecmc/api/switch/sendapiphonecode',_item).then(function (response) {
                return response.data;
            });
        };
        apimanageService.updateApiPhone = function(_item){
            return $http.post('/api/ecmc/api/switch/editapiswitchphone',_item).then(function (response) {
                return response.data;
            });
        };
        apimanageService.verifyApiPhoneCode = function(_item){
            return $http.post('/api/ecmc/api/switch/verifyapiphonecode',_item).then(function (response) {
                return response.data;
            });
        };
    }])

