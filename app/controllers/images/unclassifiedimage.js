'use strict';

angular.module('eayun.image')
    .controller('UnclassifiedImageCtrl', ['$state', '$scope','$timeout','HomeCommonService','toast','SysCode','unclassifiedimageService' ,  'eayunModal',
        function ($state,$scope,$timeout, HomeCommonService ,toast,SysCode,unclassifiedimageService,  eayunModal) {

        var gi = this;
        gi.imageName = '';
        gi.search = '';
        gi.options = {
            placeholder: "请输入镜像名称搜索",
            searchFn: function () {
                gi.table.api.draw();
            }
        };
        gi.table = {
            api: {},
            source: '/api/ecmc/cloud/image/getunclassifiedimagepagelist',
            getParams: function () {
                return {
                    dcId: gi.dcId,
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



        //编辑未分类镜像
        gi.edit = function(item){
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '编辑镜像',
                    width: '800px',
                    templateUrl: 'controllers/images/unclassifiedimage/edit.html',
                    controller: 'UnClassEditCtrl',
                    controllerAs: 'unclassedit',
                    resolve: {
                        item: function(){
                            return item;
                        }
                    }
                });
                result.then(function (_item) {
                    unclassifiedimageService.updateUnclassifiedImage(_item).then(function(data){
                        if(data.respCode == SysCode.success){
                            toast.success('镜像编辑成功');
                        }else{
                            eayunModal.error('镜像编辑失败');
                        }
                        gi.table.api.draw();
                    });
                });
        };

        //删除未分类镜像
        gi.delete = function(item){
                eayunModal.confirm('确定要删除镜像:'+item.imageName+'？').then(function () {
                        unclassifiedimageService.deleteImage(item).then(function(data){
                            if(data.respCode == SysCode.success){
                                toast.success('镜像删除成功');
                            }else{
                                eayunModal.error('镜像删除失败');
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