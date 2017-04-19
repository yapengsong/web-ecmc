/**
 * Created by eayun on 2016/4/7.
 */
'use strict'

angular.module('eayun.price')
    .controller('PriceCtrl', ['eayunModal', 'toast', 'SysCode','HomeCommonService','priceService', function (eayunModal, toast, SysCode,HomeCommonService,priceService) {
        var vm = this;
        vm.dcId = '';
        vm.resourcesType = '';
        vm.search = '';
        vm.options = {
            placeholder: "请输入计费因子搜索",
            searchFn: function () {
                vm.factorTable.api.draw();
            }
        };
        HomeCommonService.getDcList().then(function (response) {
            vm.dcList = response;
        });
        priceService.getAllTypes().then(function (data) {
            if(data.respCode == SysCode.success){
                vm.typeList = data.data;
            }
        });
        vm.factorTable = {
            source: '/api/billing/factor/getfactorsbytypedcid',
            api: {},
            getParams: function () {
                return {
                    dcId: vm.dcId,
                    resourcesType: vm.resourcesType,
                    billingFactor: vm.search
                };
            }
        };
        vm.change = function(){
            vm.factorTable.api.draw();
        };
        vm.configPrice = function(item,payType){
            vm.title = '配置预付费价格';
            if('2' == payType){
                vm.title = '配置后付费价格';
            }
            var result = eayunModal.dialog({
                showBtn: false,
                title: vm.title,
                width: '750px',
                templateUrl: 'controllers/price/config/config.html',
                controller: 'ConfigCtrl',
                controllerAs: 'config',
                resolve: {
                    item: function(){
                        return item;
                    },
                    payType: function(){
                        return payType;
                    }
                }
            });
            result.then(function () {
            });
        };
    }]);