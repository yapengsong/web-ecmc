/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.net')
    .controller('EditPortMappingCtrl', ['$scope', 'dcId', 'prjId', 'portMapping', 'NetRouter', function ($scope, dcId, prjId, portMapping, NetRouter) {
        var vm = this;

        vm.portMapping = angular.copy(portMapping, {});

        vm.vm = {};

        if(vm.portMapping.subnetId){
            NetRouter.getVmListBySubnetId(vm.portMapping.subnetId).then(function (response) {
                vm.vmList = response.data;
                angular.forEach(vm.vmList, function (value,key) {
                    if(value.vmId == vm.portMapping.destinyId){
                        vm.vm = value;
                    }
                });
            });
        }
        NetRouter.getSubnetList(dcId, prjId, vm.portMapping.resourceId).then(function (response) {
            vm.subnetList = response;
        });

        vm.changeSubnetId = function () {
            vm.vm = null;
            NetRouter.getVmListBySubnetId(vm.portMapping.subnetId).then(function (response) {
                vm.vmList = response.data;
            });
        };
        vm.changeProtocol = function () {
            vm.checkResourcePort();
        }
        vm.checkResourcePort = function () {
            if(vm.portMapping.protocol){
                NetRouter.checkResourcePort(vm.portMapping.resourceId,vm.portMapping.resourcePort,vm.portMapping.protocol, vm.portMapping.pmId).then(function(response){
                    vm.checkResourcePortFlag = response.data;
                });
            }else {
                return false;
            }
        }
        vm.changeIp = function () {
            vm.portMapping.destinyId = vm.vm.vmId;
            vm.portMapping.destinyIp = vm.vm.vmIp;
        };

        $scope.commit = function () {
            $scope.ok(vm.portMapping);
        };
    }]);