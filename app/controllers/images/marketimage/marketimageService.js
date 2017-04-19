
'use strict';

angular.module('eayun.image')
    .service('marketimageService', ['$http', 'SysCode','Upload', '$q', function ($http, SysCode,Upload, $q) {
        var marketimageService = this;
        
        /**
         * 获取市场镜像列表
         * @param param
         * @returns {*}
         */
        marketimageService.getMarketImageList = function(param){
            return $http.post('/api/ecmc/cloud/image/getmarketimagepagelist', param).then(function (response) {
                return response.data;
            });
        };
        /**
         * 获取镜像格式列表
         */
        marketimageService.getImageFormat = function(){
            return $http.post('/api/ecmc/cloud/image/getimageformat').then(function (response) {
                return response.data.data;
            });
        };
        /* 获取所有操作系统列表 */
        marketimageService.getAllVmSysList = function () {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vm/getallvmsyslist', {}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.success:
                        deferred.resolve(response.data.data);
                    case SysCode.error:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };
        marketimageService.createMarketImage = function(data) {
            var deferred = $q.defer();
            data.$showLoading=true;
            Upload.upload({
                url: '/api/ecmc/cloud/image/createmarketimage',//提交后台的
                data: data
            }).then(function (response) {
                switch (response.data.respCode){
                    case SysCode.success:
                        deferred.resolve(response.data);
                    case SysCode.error:
                        deferred.reject();
                }
            },function(){
                $("#loadingBar").hide();
            });
            return deferred.promise;
        };


        //启用镜像
        marketimageService.openImage = function (_item) {
            return $http.post('/api/ecmc/cloud/image/useimage',_item).then(function (response) {
                return response.data;
            });
        };

        //停用镜像
        marketimageService.closeImage = function (_item) {
            return $http.post('/api/ecmc/cloud/image/closeimage',_item).then(function (response) {
                return response.data;
            });
        };

        marketimageService.deleteImage = function (_item) {
            return $http.post('/api/ecmc/cloud/image/deleteimage',_item).then(function (response) {
                return response.data;
            });
        };
        marketimageService.getImageById = function (imageId) {
            return $http.post('/api/ecmc/cloud/image/getimagebyid',{'imageId':imageId,'imageType':'3'}).then(function (response) {
                return response.data;
            });
        };
        marketimageService.updateMarketImage = function (_item) {
            return $http.post('/api/ecmc/cloud/image/updatemarketimage',_item).then(function (response) {
                return response.data;
            });
        };

        marketimageService.updateMarketImageDesc = function (_item) {
            return $http.post('/api/ecmc/cloud/image/updatemarketimagedesc',_item).then(function (response) {
                return response.data;
            });
        };

        marketimageService.checkName = function (_item) {
            return $http.post('/api/ecmc/cloud/image/checkimagename',_item).then(function (response) {
                return response.data;
            });
        };
        marketimageService.addPublicImage = function (_item) {
            return $http.post('/api/ecmc/cloud/image/createpublicimage',_item).then(function (response) {
                return response.data;
            });
        };

        marketimageService.getOsList = function () {
            return $http.post('/api/ecmc/cloud/vm/getoslist').then(function (response) {
                return response.data;
            });
        };
        marketimageService.getSysListByOs = function (osId) {
            return $http.post('/api/ecmc/cloud/vm/getsystypelistbyos',{'osId':osId}).then(function (response) {
                return response.data;
            });
        };
        marketimageService.checkSavingCount = function () {
            return $http.post('/api/ecmc/cloud/image/checksavingcount').then(function (response) {
                return response.data;
            });
        };

    }]);