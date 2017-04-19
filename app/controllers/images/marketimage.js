'use strict';

angular.module('eayun.image')
    .controller('MarketImageCtrl', ['$state', '$scope','$timeout','HomeCommonService','toast','SysCode','marketimageService' ,  'eayunModal',
        function ($state,$scope,$timeout, HomeCommonService ,toast,SysCode,marketimageService,  eayunModal) {

        var vm = this;
        vm.imageName = '';
        vm.search = '';
        vm.options = {
            placeholder: "请输入市场镜像名称搜索",
            searchFn: function () {
                vm.table.api.draw();
            }
        };
        vm.table = {
            api: {},
            source: '/api/ecmc/cloud/image/getmarketimagepagelist',
            getParams: function () {
                return {
                    dcId: vm.dcId,
                    professionType: vm.professionType,
                    imageName: vm.search,
                    isUse: vm.isUse
                };
            },
            result: []
        };


        vm.query = function () {
            vm.table.api.draw();
        };

        HomeCommonService.getDcList().then(function (data) {
            vm.dcList = data;
        });


        HomeCommonService.getMarketTypeList().then(function(data) {
                vm.marketTypeList = data.data;
        });

        vm.queryTable = function () {
            vm.table.api.refresh();
        };

        vm.refresh = function () {
            var i, item;
            for (i = 0; i < vm.table.result.length; i++) {
                item = vm.table.result[i];
                if (item.imageStatus == 'SAVING'
                    || item.imageStatus == 'DELETING'
                    ||item.imageStatus=='QUEUED') {
                    vm.queryTable();
                    break;
                    }
                }
        };

        vm.vmStatusClass = [];

        //详情
        vm.detail = function(imageId){
            if (null == imageId || 'null' == imageId || '' == imageId) {
                return;
            } else {
                $state.go('app.cloudhost.marketimagedetail', {imageId: imageId});
            }
        };



        //删除
        vm.delete = function(item){
            eayunModal.confirm('确定要删除镜像'+(item.imageName.length>50?(item.imageName.substring(0,49)+"..."):item.imageName)+'？').then(function () {
                if(item.isUse=='1'){
                    eayunModal.warning('请停用镜像后再操作');
                    return;
                }
                if(item.vmNum == 0){
                    marketimageService.deleteImage(item).then(function(data){
                        if(data.respCode == SysCode.success){
                            toast.success('镜像删除成功');
                        }else{
                            eayunModal.error('镜像删除失败');
                        }
                        vm.table.api.draw();
                    });
                }else{
                    eayunModal.warning('有基于该镜像创建的云主机无法删除');
                }
            });
        };

        //启用市场镜像
        vm.openImage=function(item){
            eayunModal.confirm('确定要启用该镜像？ 启用前请确保已进入价格配置页设置和核对过该镜像的单价，同时镜像启用成功，不可以修改镜像所属类型。').then(function () {
                marketimageService.openImage(item).then(function(data){
                        if(data.respCode == SysCode.success){
                            toast.success('镜像启用成功');
                        }else{
                            eayunModal.error('镜像启用失败');
                        }
                        vm.table.api.draw();
                    });
            });
        };


        //停用市场镜像
         vm.closeImage=function(item){
                eayunModal.confirm('确定要停用镜像'+(item.imageName.length>50?(item.imageName.substring(0,49)+"..."):item.imageName)+'? 镜像停用后，管理控制台中用户无法选择使用。').then(function () {
                    marketimageService.closeImage(item).then(function(data){
                        if(data.respCode == SysCode.success){
                            toast.success('镜像停用成功');
                        }else{
                            eayunModal.error('镜像停用失败');
                        }
                        vm.table.api.draw();
                    });
                });
          };

        //创建
        vm.create = function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '上传市场镜像',
                width:800,
                templateUrl: 'controllers/images/marketimage/createmarket.html',
                controller: 'CreateMarketImageCtrl',
                controllerAs: 'createmarket',
                resolve: {
                }
            });
            result.then(function (data) {
                if(data.respCode == SysCode.success){
                    toast.success('市场镜像'+(data.data.imageName.length > 8 ? data.data.imageName.substring(0, 7) + '...' : data.data.imageName)+'上传成功');
                    vm.table.api.draw();
                }else{
                    eayunModal.error('市场镜像上传失败');
                }
            });
        };
        //编辑
        vm.edit = function(item){
            var result = eayunModal.dialog({
                showBtn: false,
                title: '编辑镜像',
                width: '800px',
                templateUrl: 'controllers/images/marketimage/edit.html',
                controller: 'MarketEditCtrl',
                controllerAs: 'marketedit',
                resolve: {
                    item: function(){
                        return item;
                    }
                }
            });
            result.then(function (_item) {
                marketimageService.updateMarketImage(_item).then(function(data){
                    if(data.respCode == SysCode.success){
                        toast.success('镜像编辑成功');
                    }else{
                        eayunModal.error('镜像编辑失败');
                    }
                    vm.table.api.draw();
                });
            });
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
                    vm.table.api.draw();
                });
            });
        };

        vm.imageStatusClass = [];
        //状态颜色
        vm.checkImageStatus = function (_imageModel, _index) {
            vm.imageStatusClass[_index] = '';
            if (_imageModel.imageStatus == 'ACTIVE'&&_imageModel.isUse=='1') {
                return 'green';
            }
            else if (_imageModel.imageStatus == 'ERROR'||_imageModel.isUse=='0'||_imageModel.isUse=='2') {
                return 'gray';
            }
            else if (_imageModel.imageStatus == 'SAVING' || _imageModel.imageStatus == 'QUEUED'|| _imageModel.imageStatus == 'DELETING') {
                return 'yellow';
            }
            else {
                return 'red';
            }
        };
    }]);