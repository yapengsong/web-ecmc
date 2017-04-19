/**
 * Created by ZHL on 2016/3/17.
 */
'use strict';

angular.module('eayun.overview')
    .controller('OverviewResCtrl', ['eayunModal','OverViewService', function (eayunModal,OverViewService) {
        var vm = this;
        vm.resourceType = "";
        vm.sortType = "down";
        vm.query = function () {
            vm.time = new Date().getTime();
            OverViewService.getDcResourceList(vm.resourceType, vm.sortType).then(function (data) {
                vm.dcList = data;
            });
        };
        OverViewService.getResourceTypeList().then(function (data) {
            vm.resourceTypeList = data;
            vm.resourceType = data[0].nodeNameEn;
            vm.query();
        });
        vm.histogram = function (model) {
        	eayunModal.dialog({
                showBtn: false,
                title: '',
                width: '650px',
                templateUrl: 'controllers/overview/histogram.html',
                controller: 'HistogramCtrl',
                controllerAs: 'his',
                resolve: {
                    Model: function () {
                        return model;
                    }
                }
            });
        };
    }]);