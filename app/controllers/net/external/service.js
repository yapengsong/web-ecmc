/**
 * Created by ZHL on 2016/4/7.
 */
'use strict';

angular.module('eayun.overview')
    .service('NetExternal', ['$http', function ($http) {
        var external = this;
        external.getSelectList = function (dcId) {
            return $http.post('/api/ecmc/virtual/networkout/selectoutnet', {dcId: dcId})
                .then(function (resp) {
                    return resp.data;
                });
        };

        external.getOutNetworkDetail = function (_netId) {
            return $http.post('/api/ecmc/virtual/networkout/getoutnetworkdetail', {netId: _netId}).then(function (response) {
                return response.data;
            });
        };

        external.editOutNet = function (outNet) {
            return $http.post('/api/ecmc/virtual/networkout/modoutnetwork', outNet).then(function (response) {
                return response.data;
            });

        };

        external.checkNetName = function (natName, netId, dcId) {
            return $http.post('/api/ecmc/virtual/networkout/checknetname', {
                netName: natName,
                netId: netId,
                dcId: dcId
            }).then(function (response) {
                return response.data;
            });
        };

        external.addOutSubnet = function (outSubNet) {
            return $http.post('/api/ecmc/virtual/outsubnetwork/addsubnetwork', outSubNet,{$showLoading : true}).then(function (response) {
                return response.data;
            });
        };

        external.editOutSubnet = function (outSubNet) {
            return $http.post('/api/ecmc/virtual/outsubnetwork/updatesubnetwork', outSubNet,{$showLoading : true}).then(function (response) {
                return response.data;
            });
        };

        external.deleteOutSubnet = function (_subnetModel) {
            return $http.post('/api/ecmc/virtual/outsubnetwork/deletesubnetwork', {
                subNetId: _subnetModel.subnetId,
                dcId: _subnetModel.dcId,
                subNetName: _subnetModel.subnetName,
                prjId: _subnetModel.prjId
            }).then(function (response) {
                return response.data;
            });

        };

        external.checkOutSubnetName = function (_netId, _subnetId, _subnetName) {

            return $http.post('/api/ecmc/virtual/outsubnetwork/checkoutsubnetname', {
                netId: _netId,
                subnetId: _subnetId,
                subnetName: _subnetName
            }).then(function (response) {
                return response.data;
            });

        };

    }]);