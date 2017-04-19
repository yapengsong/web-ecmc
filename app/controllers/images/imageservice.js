/**
 * Created by gw on 2016/4/28.
 */
angular.module('eayun.image')
    .service('GlobalService', ['$http', '$q','Upload', 'SysCode', function ($http, $q,Upload, SysCode) {
        var globalService = this;
        /**
         * 获取公共镜像列表
         * @param param
         * @returns {*}
         */
        globalService.getGlobalImageList = function(param){
            return $http.post('/api/ecmc/cloud/image/getconimagepagelist', param).then(function (response) {
                return response.data;
            });
        };
        /**
         * 获取镜像格式列表
         */
        globalService.getImageFormat = function(){
            return $http.post('/api/ecmc/cloud/image/getimageformat').then(function (response) {
                return response.data.data;
            });
        };
        /* 获取所有操作系统列表 */
        globalService.getAllVmSysList = function () {
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



        globalService.createPublicImage = function(data) {
            var deferred = $q.defer();
            data.$showLoading=true;
            Upload.upload({
                url: '/api/ecmc/cloud/image/createpublicimage',//提交后台的
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
        globalService.delete = function (image) {
            return $http.post('/api/ecmc/virtual/network/deletenetwork', image).then(function (response) {
                return response.data;
            })
        };
        globalService.edit = function (image) {
            return $http.post('/api/ecmc/virtual/network/modnetwork', image).then(function (response) {
                return response.data;
            })
        };

        //启用镜像
        globalService.openImage = function (_item) {
            return $http.post('/api/ecmc/cloud/image/useimage',_item).then(function (response) {
                return response.data;
            });
        };

        //停用镜像
        globalService.closeImage = function (_item) {
            return $http.post('/api/ecmc/cloud/image/closeimage',_item).then(function (response) {
                return response.data;
            });
        };

        globalService.deleteImage = function (_item) {
            return $http.post('/api/ecmc/cloud/image/deleteimage',_item).then(function (response) {
                return response.data;
            });
        };
        globalService.getImageById = function (imageId) {
            return $http.post('/api/ecmc/cloud/image/getimagebyid',{'imageId':imageId,'imageType':'1'}).then(function (response) {
                return response.data;
            });
        };
        globalService.updatePublicImage = function (_item) {
            return $http.post('/api/ecmc/cloud/image/updatepublicimage',_item).then(function (response) {
                return response.data;
            });
        };
        globalService.checkName = function (_item) {
            return $http.post('/api/ecmc/cloud/image/checkimagename',_item).then(function (response) {
                return response.data;
            });
        };
        globalService.addPublicImage = function (_item) {
            return $http.post('/api/ecmc/cloud/image/createpublicimage',_item).then(function (response) {
                return response.data;
            });
        };

        globalService.getOsList = function () {
            return $http.post('/api/ecmc/cloud/vm/getoslist').then(function (response) {
                return response.data;
            });
        };
        globalService.getSysListByOs = function (osId) {
            return $http.post('/api/ecmc/cloud/vm/getsystypelistbyos',{'osId':osId}).then(function (response) {
                return response.data;
            });
        };
        globalService.checkSavingCount = function () {
            return $http.post('/api/ecmc/cloud/image/checksavingcount').then(function (response) {
                return response.data;
            });
        };

    }]);