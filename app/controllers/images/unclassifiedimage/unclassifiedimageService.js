
'use strict';

angular.module('eayun.image')
    .service('unclassifiedimageService', ['$http', 'SysCode', '$q', function ($http, SysCode, $q) {
        var unclassifiedimageService = this;
        
        /**
         * 获取未分类镜像列表
         * @param param
         * @returns {*}
         */
        unclassifiedimageService.getUnclassifiedImageList = function(param){
            return $http.post('/api/ecmc/cloud/image/getUnclassifiedimagepagelist', param).then(function (response) {
                return response.data;
            });
        };
        /**
         * 获取镜像格式列表
         */
        unclassifiedimageService.getImageFormat = function(){
            return $http.post('/api/ecmc/cloud/image/getimageformat').then(function (response) {
                return response.data.data;
            });
        };
        /* 获取所有操作系统列表 */
        unclassifiedimageService.getAllVmSysList = function () {
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


        unclassifiedimageService.deleteImage = function (_item) {
            return $http.post('/api/ecmc/cloud/image/deleteimage',_item).then(function (response) {
                return response.data;
            });
        };
        unclassifiedimageService.getImageById = function (imageId) {
            return $http.post('/api/ecmc/cloud/image/getimagebyid',{'imageId':imageId,'imageType':'1'}).then(function (response) {
                return response.data;
            });
        };
        unclassifiedimageService.updateUnclassifiedImage = function (_item) {
            return $http.post('/api/ecmc/cloud/image/updateunclassifiedimage',_item).then(function (response) {
                return response.data;
            });
        };
        unclassifiedimageService.checkName = function (_item) {
            return $http.post('/api/ecmc/cloud/image/checkimagename',_item).then(function (response) {
                return response.data;
            });
        };

        unclassifiedimageService.checkSavingCount = function () {
            return $http.post('/api/ecmc/cloud/image/checksavingcount').then(function (response) {
                return response.data;
            });
        };

    }]);