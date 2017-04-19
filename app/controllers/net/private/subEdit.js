/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.net')
    .controller('NetPrivateSubnetSaveCtrl', ['$scope', 'subnet', 'HomeCommonService', 'eayunModal', 'NetSubnet', 'toast', 'utils',
        function ($scope, _subnet, HomeCommonService, eayunModal, NetSubnet, toast, utils) {
            var vm = this;
            vm.name = _subnet.subnetName;
            vm.checkName = function (value) {
                return NetSubnet.checkName(_subnet.dcId, _subnet.prjId, value, _subnet.subnetId);
            };
            var item = function () {
                this.value = undefined;
                this.min = 0;
                this.max = 255;
                this.valid = false;
            };
            item.prototype.check = function () {
                var intValue = parseInt(this.value);
                this.valid = (intValue + '') == this.value && (intValue >= this.min && intValue <= this.max);
                return this.valid;
            };
            item.prototype.dirty = function () {
                return this.value !== undefined;
            };
            item.prototype.setValue = function (value) {
                this.value = value;
                this.check();
            };
            item.prototype.reset = function () {
                this.value = undefined;
            };
            var dnsData = function () {
                var a = [new item(), new item(), new item(), new item()];
                a.select = false;
                a.getStr = function () {
                    return a[0].value + '.' + a[1].value + '.' + a[2].value + '.' + a[3].value;
                };
                a.valid = function () {
                    return a[0].valid && a[1].valid && a[2].valid && a[3].valid;
                };
                a.dirty = function () {
                    return a[0].dirty() && a[1].dirty() && a[2].dirty() && a[3].dirty();
                };
                return a;
            };
            var parseDate = function () {
                var array = [new dnsData(), new dnsData(), new dnsData()];
                var dnsList = _subnet.dns?_subnet.dns.split(';'):[];
                for (var i = 0; i < dnsList.length; i++) {
                    if (dnsList[i]) {
                        var num = dnsList[i].split('.');
                        array[i].select = true;
                        for (var j = 0; j < num.length; j++) {
                            array[i][j].setValue(parseInt(num[j]));
                        }
                    }
                }
                return array;
            };
            vm.dns = parseDate();
            vm.dns.hasError = false;
            vm.dns.valid = function () {
                var valid = true;
                angular.forEach(vm.dns, function (value) {
                    if (value.select && (value.repeat || !value.valid())) {
                        valid = false;
                    }
                });
                vm.dns.hasError = !valid;
                return valid;
            };
            vm.dns.getStr = function () {
                var str = [];
                angular.forEach(vm.dns, function (dns) {
                    if (dns.select && dns.valid()) {
                        str.push(dns.getStr());
                    }
                });
                return str.join(';');
            };
            vm.focus = function (item) {
                vm.curItem = item;
            };
            vm.blur = function () {
                vm.curItem = undefined;
            };
            vm.dnsClick = function (dns) {
                angular.forEach(dns, function (value) {
                    if (!dns.select) {
                        value.reset();
                    }else{
                        value.value=0;
                    }
                    value.check();
                });
                vm.checkRepeat();
                vm.dns.valid();
            };
            vm.numCheck = function (value, newValue) {
                newValue = parseInt(newValue) || '';
                return newValue;
            };
            vm.check = function (item) {
                item.check();
                vm.checkRepeat();
                vm.dns.valid();
            };
            vm.checkRepeat = function () {
                var map = {};
                vm.dns.repeat = false;
                angular.forEach(vm.dns, function (value, index) {
                    value.repeat = false;
                    if (value.select && value.valid()) {
                        var str = value.getStr();
                        if (map[str] !== undefined) {
                            value.repeat = true;
                            vm.dns[map[str]].repeat = true;
                            vm.dns.repeat = true;
                        } else {
                            map[str] = index;
                        }
                    }
                });
            };

            $scope.commit = function () {
                $scope.checkBtn = true;
                NetSubnet.edit(_subnet.dcId, _subnet.prjId, vm.name, _subnet.subnetId, vm.dns.getStr(), _subnet.subnetType)
                    .then(function (data) {
                        $scope.ok(data);
                        $scope.checkBtn = false;
                        toast.success("修改子网" + utils.ellipsis(vm.name, 10) + "成功");
                    }, function (message) {
                        if(message != '010120'){
                            eayunModal.warning(message);
                        }
                        $scope.checkBtn = false;
                    });
            };
        }]);