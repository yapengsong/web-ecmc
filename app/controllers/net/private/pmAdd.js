/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.net')
    .controller('AddPortMappingCtrl', ['$scope', 'dcId', 'prjId', 'routeId', 'gatewayIp', 'NetRouter', function ($scope, dcId, prjId, routeId, gatewayIp, NetRouter) {
        var vm = this;
        vm.gatewayIp = gatewayIp;

        vm.vm = {};

        NetRouter.getSubnetList(dcId, prjId, routeId).then(function (response) {
            vm.subnetList = response;
        });

        vm.changeSubnetId = function () {
            vm.vm = null;
            NetRouter.getVmListBySubnetId(vm.subnetId).then(function (response) {
                vm.vmList = response.data;
            });
        };
        vm.changeProtocol = function () {
            /*$scope.myForm.resourcePort.$validate();*/
            vm.checkResourcePort();
        }
        vm.checkResourcePort = function () {
            if(vm.protocol){
                NetRouter.checkResourcePort(routeId,vm.resourcePort,vm.protocol, vm.pmId).then(function(response){
                    vm.checkResourcePortFlag = response.data;
                });
            }else {
                return false;
            }
        }

        $scope.commit = function () {
            var portMapping = {
                dcId: dcId,
                prjId: prjId,
                protocol: vm.protocol,
                resourceId: routeId,
                resourceIp: gatewayIp,
                resourcePort: vm.resourcePort,
                destinyId: vm.vm.vmId,
                destinyIp: vm.vm.vmIp,
                destinyPort: vm.destinyPort
            };
            $scope.ok(portMapping);
        };
    }])