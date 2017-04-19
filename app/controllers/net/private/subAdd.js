/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.net')
    .controller('NetPrivateSubnetAddCtrl', ['$scope', 'subnet', 'HomeCommonService', 'eayunModal', 'NetSubnet', 'toast', 'utils',
        function ($scope, _subnet, HomeCommonService, eayunModal, NetSubnet, toast, utils) {
            var vm = this;
            vm.subnetType = '1';
            vm.checkName = function (value) {
                return NetSubnet.checkName(_subnet.dcId, _subnet.prjId, value, _subnet.subnetId);
            };
            NetSubnet.getDnsByDcId(_subnet.dcId).then(function(response){
                $scope.dns = response;
            });
            var item = function (_value, _readonly, _min, _max) {
                this.value = _value;
                this.readonly = _readonly;
                this.min = _min;
                this.max = _max;
                this.valid = true;
            };
            var a = [new item(10, true, 0, 255), new item(0, false, 0, 255), new item(0, false, 0, 255), new item(0, true, 0, 255), new item(16, false, 16, 24)];
            var b = [new item(172, true, 0, 255), new item(16, false, 16, 31), new item(0, false, 0, 255), new item(0, true, 0, 255), new item(16, false, 16, 24)];
            var c = [new item(192, true, 0, 255), new item(168, true, 0, 255), new item(0, false, 0, 255), new item(0, true, 0, 255), new item(24, true, 16, 24)];

            vm.cidrs = [a, b, c];
            vm.focus = function (item) {
                $scope.dnsFlag = false;
                vm.curItem = item;
            };
            vm.blur = function () {
                vm.curItem = undefined;
            };
            vm.check = function (value, newValue) {
                newValue = parseInt(newValue) || 0;
                var check = newValue >= vm.curItem.min && newValue <= vm.curItem.max;
                vm.curItem.valid = check;
                vm.changeErr();
                return newValue+'';
            };

            vm.changeErr = function (){
                vm.cidrErr = false;
                var cidr = vm.cidrs[vm.radio];
                for (var i = 0; i < cidr.length; i++) {
                    if (!cidr[i].valid) {
                        vm.cidrErr = true;
                        break;
                    }
                }
            };
            vm.changeSubnetCidr = function(){
                $scope.dnsFlag = false;
                var a = [new item(10, true, 0, 255), new item(0, false, 0, 255), new item(0, false, 0, 255), new item(0, true, 0, 255), new item(16, false, 16, 24)];
                var b = [new item(172, true, 0, 255), new item(16, false, 16, 31), new item(0, false, 0, 255), new item(0, true, 0, 255), new item(16, false, 16, 24)];
                var c = [new item(192, true, 0, 255), new item(168, true, 0, 255), new item(0, false, 0, 255), new item(0, true, 0, 255), new item(24, true, 16, 24)];

                vm.cidrs = [a, b, c];
                vm.changeErr();

            };
            $scope.commit = function () {
                $scope.checkBtn = true;
                var cidr = vm.cidrs[vm.radio];
                for (var i = 0; i < cidr.length; i++) {
                    if (!cidr[i].valid) {
                        return eayunModal.warning('请输入正确的IPv4地址格式')
                    }
                }
                var cidrStr = cidr[0].value + '.' + cidr[1].value + '.' + cidr[2].value + '.' + cidr[3].value + '/' + cidr[4].value;
                $scope.cidrStr = cidrStr;
                NetSubnet.checkCidrByNetworkId(cidrStr, _subnet.networkId)
                    .then(function () {
                        NetSubnet.add(_subnet.dcId, _subnet.prjId, vm.name, cidrStr, _subnet.networkId, vm.subnetType, $scope.dns)
                            .then(function (data) {
                                $scope.ok(data);
                                $scope.checkBtn = false;
                                toast.success("添加子网" + utils.ellipsis(vm.name,10) + "成功");
                            }, function (message) {
                                if (message != '010120') {
                                    eayunModal.warning(message);
                                }
                                $scope.checkBtn = false;
                            });
                    }, function () {
                        $scope.dnsFlag = true;
                        $scope.checkBtn = false;
                    });
            };
        }]);