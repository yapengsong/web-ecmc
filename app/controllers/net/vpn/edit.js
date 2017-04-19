/**
 * Created by eayun on 2016/8/23.
 */
'use strict'

angular.module('eayun.net')
    .controller('EditVpnCtrl', [ '$scope','vpnModel', 'vpnService', function ($scope, vpnModel,vpnService) {
        var vm = this;
        vm.checkPeerCidrsFlag = true;
        vm.mtuSixtyEight = true;
        vm.checkTimeout = true;
        vm.vpnModel = angular.copy(vpnModel, {});
        var getPeers = function () {
            var peers = vm.vpnModel.peerAddress.split('.');
            vm.vpnModel.$$peerAddress1 = peers[0];
            vm.vpnModel.$$peerAddress2 = peers[1];
            vm.vpnModel.$$peerAddress3 = peers[2];
            vm.vpnModel.$$peerAddress4 = peers[3];
        };
        getPeers();
        $scope.commit = function (vpnModel) {
            vpnModel.peerAddress = vm.vpnModel.$$peerAddress1 + '.' + vm.vpnModel.$$peerAddress2 + '.' +
                vm.vpnModel.$$peerAddress3 + '.' + vm.vpnModel.$$peerAddress4;
            $scope.ok(vpnModel);
        };

        vm.checkVpnNameExist = function () {
            vpnService.checkVpnNameExist(vm.vpnModel).then(function (response) {
                vm.isNameExist = response;
            });
        };
        vm.checkPeerCidrs = function () {
            var inputFormat = /^(([01]?\d?\d|2[0-4]\d|25[0-5])\.){3}([01]?\d?\d|2[0-4]\d|25[0-5])\/(\d{1}|[0-2]{1}\d{1}|3[0-2])$/;
            vm.checkPeerCidrsFlag = vpnService.checkPeerCidrs(vm.vpnModel, inputFormat);
        };
        vm.checkMtu = function () {
            if (vm.vpnModel.mtu >= 68) {
                vm.mtuSixtyEight = true;
            } else {
                vm.mtuSixtyEight = false;
            }
        };
        /*校验时间间隔*/
        vm.checkInterval = function () {
            if(vm.vpnModel.dpdInterval == '' || vm.vpnModel.dpdTimeout == '')
                return ;
            var regExp = new RegExp("^[1-9][0-9]{0,8}$");
            if(!regExp.test(vm.vpnModel.dpdInterval) || !regExp.test(vm.vpnModel.dpdTimeout))
                return ;
            if (parseInt(vm.vpnModel.dpdInterval) < parseInt(vm.vpnModel.dpdTimeout)) {
                vm.checkTimeout = true;
            } else {
                vm.checkTimeout = false;
            }
        };
    }]);
