/**
 * Created by eayun on 2016/8/23.
 */
'use strict'

angular.module('eayun.net')
    .controller('DetailVpnCtrl', ['$stateParams', 'vpnService', function ($stateParams, vpnService) {
        var vm = this;
        vpnService.getVpnInfo($stateParams.vpnId).then(function (response) {
            vm.vpnModel = response;
            vm.getIpSecEncapsulation();
            vm.getDpdActionStr(vm.vpnModel.dpdAction);
            vm.getInitiator(vm.vpnModel.initiator);
            vm.vpnStatusClass = vm.getVpnStatusClass(vm.vpnModel);
        });
        /*封装模式转义*/
        vm.getIpSecEncapsulation = function () {
            vm.ipSecEncapsulationStr = "隧道模式";
        };

        /*失效处理状态转义*/
        vm.getDpdActionStr = function (_dpdAction) {
            switch (_dpdAction) {
                case 'hold':
                    vm.dpdActionStr = '保留';
                    break;
                case 'clear':
                    vm.dpdActionStr = '清除';
                    break;
                case 'disabled':
                    vm.dpdActionStr = '禁用';
                    break;
                case 'restart':
                    vm.dpdActionStr = '充值';
                    break;
                default : break;
            }
        };
        /*发起状态转义*/
        vm.getInitiator = function (_initiator) {
            switch (_initiator) {
                case 'response-only':
                    vm.initiatorStr = '只应答';
                    break;
                case 'bi-directional':
                    vm.initiatorStr = '双向';
                    break;
            }
        };
        vm.getVpnStatusClass = function (_vpn) {
            if (_vpn.vpnStatus == 'ACTIVE' && _vpn.chargeState == '0') {
                return 'green';
            } else if (_vpn.vpnStatus == 'ERROR' || _vpn.chargeState != '0') {
                return 'gray';
            } else if (_vpn.vpnStatus == 'PENDING_CREATE' && _vpn.chargeState == '0') {
                return 'yellow';
            }
        };

    }]);
