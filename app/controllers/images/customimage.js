'use strict';

angular.module('eayun.image')
    .controller('CustomImageCtrl', ['$state', '$scope','$timeout','HomeCommonService', 'toast','SysCode','eayunModal','customimageService',
        function ($state, $scope,$timeout,HomeCommonService ,toast, SysCode,eayunModal,customimageService) {
        var vm = this;
        vm.search = '';
        vm.options = {
            searchFn: function () {
                vm.imageTable.api.draw();
            },
            select: [{imageName: '名称'},{cusOrg: '客户'},{prjName: '项目'}],
            series: {
                cusOrg: {
                    multi: true,
                    data: function () {
                        return HomeCommonService.getAllCusOrgName().then(function (data) {
                            return data;
                        });
                    }
                },
                prjName: {
                    multi: true,
                    data: function () {
                        return HomeCommonService.getAllPrjName().then(function (data) {
                            return data;
                        });
                    }
                }
            }
        };

        vm.datacenterId = '';
        vm.imageTable = {
            api: {},
            source: '/api/ecmc/cloud/image/getimagepagelist',
            getParams: function () {
                return {
                    dcId: vm.datacenterId,
                    queryType: vm.search.key ? vm.search.key : '',
                    queryName: vm.search.value ? vm.search.value : '',
                    sourceType:vm.sourceType
                };
            },
            result: []
        };

        vm.query= function(){
           vm.imageTable.api.draw();
        };

        HomeCommonService.getDcList().then(function (response) {
            vm.dcList = response;
        });
        vm.queryTable = function(){
            vm.imageTable.api.refresh();
        };

        vm.refresh = function () {
            var i, item;
            for (i = 0; i < vm.imageTable.result.length; i++) {
                item = vm.imageTable.result[i];
                if (item.imageStatus == 'SAVING'
                    || item.imageStatus == 'DELETING'
                    ||item.imageStatus=='QUEUED') {
                    vm.queryTable();
                    break;
                    }
                }
        };


        vm.detail = function(imageId){
            var result = eayunModal.dialog({
                showBtn: false,
                title: '镜像详情',
                width: '800px',
                templateUrl: 'controllers/images/customimage/detail.html',
                controller: 'CustomDetailCtrl',
                controllerAs: 'customdetail',
                resolve: {
                    imageId: function(){
                        return imageId;
                    }
                }
            });
            result.then(function () {
                //vm.imageTable.api.draw();
            });
        };
        vm.edit = function(item){
            var result = eayunModal.dialog({
                showBtn: false,
                title: '编辑自定义镜像',
                width: '800px',
                templateUrl: 'controllers/images/customimage/edit.html',
                controller: 'CustomEditCtrl',
                controllerAs: 'customedit',
                resolve: {
                    item: function(){
                        return item;
                    }
                }
            });
            result.then(function (_item) {
                customimageService.updatePersonImage(_item).then(function(data){
                    if(data.respCode == SysCode.success){
                        toast.success('镜像编辑成功');
                    }else{
                        eayunModal.error('镜像编辑失败');
                    }
                    vm.imageTable.api.draw();
                });
            });
        };
        vm.delete = function(item){
            eayunModal.confirm('确定要删除镜像'+item.imageName+'？').then(function () {
                if(item.imageStatus=='DELETING'){
                    eayunModal.warning('镜像正在删除中，请稍后');
                }else if(item.vmNum == 0){
                    customimageService.deleteImage(item).then(function(data){
                        if(data.respCode == SysCode.success){
                            toast.success('镜像删除成功');
                        }else{
                            eayunModal.error('镜像删除失败');
                        }
                        vm.imageTable.api.draw();
                    });
                }else{
                    eayunModal.warning('有基于该镜像创建的云主机无法删除');
                }
            });
        };
        vm.imageStatusClass = [];

        //状态颜色
        vm.checkImageStatus = function (_imageModel, _index) {
            vm.imageStatusClass[_index] = '';
            if (_imageModel.imageStatus == 'ACTIVE') {
                return 'green';
            }
            else if (_imageModel.imageStatus == 'ERROR') {
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