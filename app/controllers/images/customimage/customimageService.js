'use strict';

angular.module('eayun.image')
    .service('customimageService', ['$http', 'SysCode', '$q', function ($http, SysCode, $q) {
        var customimageService = this;
        customimageService.deleteImage = function (_item) {
            return $http.post('/api/ecmc/cloud/image/deleteimage',_item).then(function (response) {
                return response.data;
            });
        };
        customimageService.getImageById = function (imageId) {
            return $http.post('/api/ecmc/cloud/image/getimagebyid',{'imageId':imageId,'imageType':'2'}).then(function (response) {
                return response.data;
            });
        };
        customimageService.updatePersonImage = function (_item) {
            return $http.post('/api/ecmc/cloud/image/updatepersonimage',_item).then(function (response) {
                return response.data;
            });
        };
        customimageService.checkName = function (_item) {
            return $http.post('/api/ecmc/cloud/image/checkimagename',_item).then(function (response) {
                return response.data;
            });
        };
    }]);