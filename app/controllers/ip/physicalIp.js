/**
 * Created by cxy on 2016/3/25.
 */
'use strict';

angular.module('eayun.ip')
    .controller('IpPhysicalCtrl', ['IpPhysicalService', 'eayunModal', 'HomeCommonService', function (IpPhysicalService, eayunModal, HomeCommonService) {
        var vm = this;
        vm.search = '';
        vm.options = {
            searchFn: function () {
                vm.myTable.api.draw();
            },
            select: [{ip: 'IP'}, {cusName: '客户'}, {prjName: '项目'}],
            series: {
                cusName: {
                    multi: true,
                    data: function () {
                        return HomeCommonService.getAllCusOrgName();
                    }
                },
                prjName: {
                    multi: true,
                    data: function () {
                        return HomeCommonService.getAllPrjName();

                    }
                }
            }
        };
        vm.myTable = {
            source: '/api/ecmc/virtual/cloudoutip/outiplist',
            api: {},
            getParams: function () {
                var param = {
                    datacenterId: vm.dcId,
                    usestauts: vm.state,
                    distribution: vm.distribution,
                    $showLoading:true
                };
                param[vm.search.key] = vm.search.value;
                return param;
            }
        };
        IpPhysicalService.getDcList().then(function (data) {
            vm.dcResourceList = data;
        });
        vm.queryTable = function () {
            vm.myTable.api.draw();
        }
        /**详情*/
        vm.detail = function (id) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '详情',
                width: '300px',
                templateUrl: 'controllers/ip/detail/detail.html',
                controller: 'IpDetailCtrl',
                controllerAs: 'detail',
                resolve: {
                    model: function () {
                        return IpPhysicalService.getIp(id).then(function (data) {
                            return data;
                        });
                    }
                }
            });
        }
    }]);