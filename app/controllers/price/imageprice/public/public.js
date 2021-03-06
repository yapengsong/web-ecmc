/**
 * Created by eayun on 2016/4/7.
 */
'use strict'

angular.module('eayun.price')
    .controller('PublicPriceCtrl', ['eayunModal', 'toast', 'SysCode','HomeCommonService','priceService', function (eayunModal, toast, SysCode,HomeCommonService,priceService) {
        var vm = this;
        vm.dcId = '';
        vm.sysType='';
        vm.imageName='';
        vm.search = '';
        vm.options = {
            placeholder: "请输入计费因子搜索",
            searchFn: function () {
                vm.publicPriceTable.api.draw();
            }
        };
        HomeCommonService.getDcList().then(function (response) {
            vm.dcList = response;
        });
        HomeCommonService.getOsTypeList().then(function (response) {
            vm.sysTypeList = response.data;
        });
        vm.publicPriceTable = {
            source: '/api/ecmc/cloud/image/getconimagepagelist',
            api: {},
            getParams: function () {
                return {
                    dcId: vm.dcId,
                    sysType: vm.sysType,
                    imageName: vm.search
                };
            }
        };
        vm.query = function(){
            vm.publicPriceTable.api.draw();
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
                templateUrl: 'controllers/price/imageprice/imageconfig.html',
                controller: 'ImageConfigCtrl',
                controllerAs: 'imageconfig',
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