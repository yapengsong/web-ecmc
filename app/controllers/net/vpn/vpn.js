/**
 * Created by eayun on 2016/8/23.
 */
'use strict'

angular.module('eayun.net')
    .controller('VpnListCtrl', ['eayunModal',  'toast', '$state','vpnService','HomeCommonService', function (eayunModal, toast, $state,vpnService,HomeCommonService) {
        var vm = this;
        vm.dcList = {};
        HomeCommonService.getDcList().then(function (response) {
            vm.dcList = response;
        });
        vm.search = '';
        vm.options = {
            searchFn: function () {
                vm.table.api.draw();
            },
            select: [{vpnName: '名称'},{prjName: '项目'},{cusName: '客户'}],
            series: {
                cusName: {
                    multi: true,
                    data: function () {
                        return vpnService.getAllCustomerList().then(function (response) {
                            var array = [];
                            angular.forEach(response.data, function (value) {
                                array.push(value.cusOrg);
                            });
                            return array;
                        });
                    }
                },
                prjName: {
                    multi: true,
                    data: function () {
                        return vpnService.getAllProjectList().then(function (response) {
                            var array = [];
                            angular.forEach(response.data, function (value) {
                                array.push(value.prjName);
                            });
                            return array;
                        });
                    }
                }
            }
        };
        vm.table = {
            api: {},
            source: '/api/ecmc/cloud/vpn/getvpnlist',
            getParams: function () {
                if(vm.search.key=='vpnName'){
                    return{
                        datacenterId : vm.datacenterId,
                        vpnName : vm.search.value
                    }
                }else if(vm.search.key=='prjName'){
                    return{
                        datacenterId : vm.datacenterId,
                        prjName : vm.search.value
                    }
                }else{
                    return{
                        datacenterId : vm.datacenterId,
                        cusName : vm.search.value
                    }
                }
            }
        };
        vm.queryVpnTable = function () {
            vm.table.api.draw();
        };
        vm.vpnStatusClass = [];
        /*获取vpn状态颜色框的颜色类*/
        vm.checkVpnStatus = function (_vpn, _index) {
            vm.vpnStatusClass[_index] = '';
            if (_vpn.vpnStatus == 'ACTIVE' && _vpn.chargeState == '0') {
                return 'green';
            } else if (_vpn.vpnStatus == 'ERROR' || _vpn.chargeState != '0') {
                return 'gray';
            } else if (_vpn.vpnStatus == 'PENDING_CREATE' && _vpn.chargeState == '0') {
                return 'yellow';
            }
        };
        vm.getVpnInfo = function (vpnId) {
            $state.go('app.net.detailvpn', {vpnId: vpnId});
        };
        vm.delete = function (vpn) {
            var page1 = eayunModal.open({
                templateUrl: 'controllers/net/deleteone.html',
                controller: 'DeleteResourceInfo1',
                controllerAs: 'delRes1',
                resolve: {
                    name: function () {
                        return vpn.vpnName;
                    }
                }
            }).result;
            page1.then(function () {
                var page2 = eayunModal.open({
                    templateUrl: 'controllers/net/deletetwo.html',
                    controller: 'DeleteResourceInfo2',
                    controllerAs: 'delRes2',
                    resolve: {
                        name: function () {
                            return vpn.vpnName;
                        }
                    }
                }).result;
                page2.then(function () {
                    vpnService.deleteVpn(vpn).then(function(response){
                        toast.success('删除VPN服务成功！');
                        vm.table.api.draw();
                    });
                });
            });
        };
        vm.editVpn = function (_model) {
            eayunModal.dialog({
                title: '修改VPN',
                templateUrl:  'controllers/net/vpn/edit.html',
                controller: 'EditVpnCtrl',
                controllerAs: 'editVpn',
                showBtn: false,
                width: '800px',
                resolve: {
                    vpnModel: function () {
                        return _model;
                    }
                }
            }).then(function (vpnModel) {
                vpnService.updateVpn(vpnModel).then(function (response) {
                    toast.success('编辑VPN服务成功！');
                    vm.table.api.draw();
                });
            });
        };
    }]);
