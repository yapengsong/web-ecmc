'use strict';

angular.module('eayun.image')
    .controller('GlobalImageCtrl', ['$state', '$scope','$timeout','HomeCommonService','toast','SysCode','GlobalService' ,  'eayunModal',
        function ($state,$scope,$timeout, HomeCommonService ,toast,SysCode,GlobalService,  eayunModal) {

        var gi = this;
        gi.imageName = '';
        gi.search = '';
        gi.options = {
            placeholder: "请输入公共镜像名称搜索",
            searchFn: function () {
                gi.table.api.draw();
            }
        };
        gi.table = {
            api: {},
            source: '/api/ecmc/cloud/image/getconimagepagelist',
            getParams: function () {
                return {
                    dcId: gi.dcId,
                    sysType: gi.sysType,
                    imageName: gi.search,
                    isUse: gi.isUse
                };
            },
            result: []
        };


        gi.query = function () {
            gi.table.api.draw();
        };

        HomeCommonService.getDcList().then(function (data) {
            gi.dcList = data;
        });

        HomeCommonService.getOsTypeList().then(function(data) {
            gi.osList = data.data;
        });


        gi.queryTable = function () {
            gi.table.api.refresh();
        };

        gi.refresh = function () {
            var i, item;
            for (i = 0; i < gi.table.result.length; i++) {
                item = gi.table.result[i];
                if (item.imageStatus == 'SAVING'
                    || item.imageStatus == 'DELETING'
                    ||item.imageStatus=='QUEUED') {
                    gi.queryTable();
                    break;
                    }
                }
        };

        gi.vmStatusClass = [];

        //详情
        gi.detail = function(imageId){
            var result = eayunModal.dialog({
                showBtn: false,
                title: '镜像详情',
                width: '800px',
                templateUrl: 'controllers/images/globalimage/detail.html',
                controller: 'GloDetailCtrl',
                controllerAs: 'glodetail',
                resolve: {
                    imageId: function(){
                        return imageId;
                    }
                }
            });
            result.then(function () {
                //gi.table.api.draw();
            });
        };

        //删除公共镜像
        gi.delete = function(item){
            eayunModal.confirm('确定要删除镜像'+(item.imageName.length>50?(item.imageName.substring(0,49)+"..."):item.imageName)+'？').then(function () {
                if(item.isUse=='1'){
                    eayunModal.warning('请停用镜像后再操作');
                    return;
                }
                if(item.vmNum == 0){
                    GlobalService.deleteImage(item).then(function(data){
                        if(data.respCode == SysCode.success){
                            toast.success('镜像删除成功');
                        }else{
                            eayunModal.error('镜像删除失败');
                        }
                        gi.table.api.draw();
                    });
                }else{
                    eayunModal.warning('有基于该镜像创建的云主机无法删除');
                }
            });
        };

        //启用公共镜像
        gi.openImage=function(item){
            eayunModal.confirm('确定要启用该镜像？ 启用前请确保已进入价格配置页设置和核对过该镜像的单价，同时镜像启用成功，不可以修改镜像所属类型。').then(function () {
                    GlobalService.openImage(item).then(function(data){
                        if(data.respCode == SysCode.success){
                            toast.success('镜像启用成功');
                        }else{
                            eayunModal.error('镜像启用失败');
                        }
                        gi.table.api.draw();
                    });
            });
        };


        //停用公共镜像
         gi.closeImage=function(item){
                eayunModal.confirm('确定要停用镜像'+(item.imageName.length>50?(item.imageName.substring(0,49)+"..."):item.imageName)+'? 镜像停用后，管理控制台中用户无法选择使用。').then(function () {
                    GlobalService.closeImage(item).then(function(data){
                        if(data.respCode == SysCode.success){
                            toast.success('镜像停用成功');
                        }else{
                            eayunModal.error('镜像停用失败');
                        }
                        gi.table.api.draw();
                    });
                });
          };

        //创建
        gi.create = function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '上传公共镜像',
                width:800,
                templateUrl: 'controllers/images/create.html',
                controller: 'CreateGlobalImageCtrl',
                controllerAs: 'create',
                resolve: {
                }
            });
            result.then(function (data) {
                if(data.respCode == SysCode.success){
                    toast.success('公共镜像'+(data.data.imageName.length > 8 ? data.data.imageName.substring(0, 7) + '...' : data.data.imageName)+'上传成功');
                    gi.table.api.draw();
                }else{
                    eayunModal.error('公共镜像上传失败');
                }
            });
        };
        //编辑
        gi.edit = function(item){
            var result = eayunModal.dialog({
                showBtn: false,
                title: '编辑公共镜像',
                width: '800px',
                templateUrl: 'controllers/images/globalimage/edit.html',
                controller: 'GloEditCtrl',
                controllerAs: 'gloedit',
                resolve: {
                    item: function(){
                        return item;
                    }
                }
            });
            result.then(function (_item) {
                GlobalService.updatePublicImage(_item).then(function(data){
                    if(data.respCode == SysCode.success){
                        toast.success('镜像编辑成功');
                    }else{
                        eayunModal.error('镜像编辑失败');
                    }
                    gi.table.api.draw();
                });
            });
        };

        gi.imageStatusClass = [];
        //状态颜色
        gi.checkImageStatus = function (_imageModel, _index) {
            gi.imageStatusClass[_index] = '';
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