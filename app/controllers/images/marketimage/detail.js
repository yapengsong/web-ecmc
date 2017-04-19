
'use strict';

angular.module('eayun.image')
    .controller('MarketImageDetailCtrl', ['$stateParams', '$state','$scope','SysCode','eayunModal','toast','marketimageService',function ($stateParams, $state,$scope,SysCode,eayunModal,toast,marketimageService) {
        var vm = this;
        vm.item = {};

        marketimageService.getImageById($stateParams.imageId).then(function (data) {
            if(data.respCode == SysCode.success){
                vm.item = data.data;
                if('null'==vm.item.imageDescription||null==vm.item.imageDescription){
                    vm.item.imageDescription='';
                }
                checkImageStatus(vm.item);
            }
        });

        //状态颜色
        var checkImageStatus = function (item) {

            vm.imageStatusClass = '';
            if (item.imageStatus == 'ACTIVE'&&item.isUse=='1') {
                vm.imageStatusClass= 'green';
                return;
            }
            else if (item.imageStatus == 'ERROR'||item.isUse=='0'||item.isUse=='2') {
                vm.imageStatusClass= 'gray';
                return;
            }
            else if (item.imageStatus == 'SAVING' || item.imageStatus == 'QUEUED'|| item.imageStatus == 'DELETING') {
                vm.imageStatusClass= 'yellow';
                return;
            }
            else {
                vm.imageStatusClass= 'red';
                return;
            }
        };


        //编辑市场镜像描述
        vm.updateMarketImageDesc = function(item){
            var result = eayunModal.open({
                templateUrl: 'controllers/images/marketimage/editdesc.html',
                controller: 'MarketDescEditCtrl',
                backdrop:'static',
                controllerAs: 'marketdescedit',
                resolve: {
                    item: function(){
                        return item;
                    }
                }
            }).result;
            result.then(function (_item) {
                marketimageService.updateMarketImageDesc(_item).then(function(data){
                    if(data.respCode == SysCode.success){
                        toast.success('镜像编辑成功');
                    }else{
                        eayunModal.error('镜像编辑失败');
                    }
                    marketimageService.getImageById(_item.imageId).then(function (data) {
                        if(data.respCode == SysCode.success){
                            vm.item = data.data;
                            checkImageStatus(vm.item);
                        }
                    });
                });
            });
        };




    }]);