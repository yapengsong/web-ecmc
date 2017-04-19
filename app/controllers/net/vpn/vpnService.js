/**
 * Created by ZH.F on 2016/4/27.
 */
angular.module('eayun.net')
    .service('vpnService', ['$http', '$q', 'SysCode', '$state', function ($http, $q, SysCode, $state) {
        var vpnService = this;
        vpnService.getAllCustomerList = function () {
            return $http.post('/api/ecmc/overview/getallcustomerlist');
        };
        vpnService.getAllProjectList = function () {
            return $http.post('/api/ecmc/overview/getallprojectlist');
        };
        vpnService.getVpnInfo = function(_vpnId){
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vpn/getvpninfo', {vpnId: _vpnId}).then(function(response){
                deferred.resolve(response.data);
            });
            return deferred.promise;
        };
        vpnService.deleteVpn = function (_vpn) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vpn/deletevpn', {
                dcId: _vpn.dcId,
                prjId: _vpn.prjId,
                vpnId: _vpn.vpnId,
                vpnName: _vpn.vpnName,
                ikeId: _vpn.ikeId,
                ipsecId: _vpn.ipsecId,
                vpnserviceId: _vpn.vpnserviceId,
                payType: _vpn.payType
            }).then(function (response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        };
        vpnService.updateVpn = function (_vpn) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vpn/updatevpn', {
                dcId: _vpn.dcId,
                prjId: _vpn.prjId,
                payType: _vpn.payType,
                createTime: _vpn.createTime,
                endTime: _vpn.endTime,
                chargeState: _vpn.chargeState,

                vpnId: _vpn.vpnId,
                vpnName: _vpn.vpnName,
                peerId: _vpn.peerId,
                peerCidrs: _vpn.peerCidrs,
                peerAddress: _vpn.peerAddress,
                pskKey: _vpn.pskKey,
                mtu: _vpn.mtu,
                dpdAction: _vpn.dpdAction,
                dpdInterval: _vpn.dpdInterval,
                dpdTimeout: _vpn.dpdTimeout,
                initiator: _vpn.initiator,
                ikeId: _vpn.ikeId,
                ipsecId: _vpn.ipsecId,
                vpnserviceId: _vpn.vpnserviceId
            }).then(function (response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        };
        //TODO 判断VPN名称是否重复
        vpnService.checkVpnNameExist = function (_vpn) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/vpn/checkvpnnameexist', {
                prjId: _vpn.prjId,
                vpnId: _vpn.vpnId,
                vpnName: _vpn.vpnName
            }).then(function (response) {
                if (response.data.respCode == '000000') {
                    deferred.resolve(response.data.respData);
                } else if (response.data.respCode == '010120') {
                    deferred.reject();
                }
            });
            return deferred.promise;
        };
        vpnService.checkPeerCidrs = function (_model, inputFormat) {
            var checkPeerCidrsFlag = true;
            var peerCidrs = _model.peerCidrs;
            if(peerCidrs.indexOf("，") >-1)
                return false;
            var peerCidr = [];
            var list = [];
            peerCidr = peerCidrs.split(",");
            for (var key = 0; key < peerCidr.length; key++){
                if(peerCidr[key] != '')
                    checkPeerCidrsFlag = inputFormat.test(peerCidr[key]);
                else
                    return false;
                if(!checkPeerCidrsFlag){
                    return checkPeerCidrsFlag;
                }else {
                    list[key] = peerCidr[key].split("/")[0];
                }
            }
            if(checkPeerCidrsFlag){
                var sList = list.join(",")+",";
                for(var i=0;i<list.length;i++) {
                    if(sList.replace(list[i]+",","").indexOf(list[i]+",")>-1) {
                        return !checkPeerCidrsFlag;
                    }
                }
            }
            return checkPeerCidrsFlag;
        };
    }]);