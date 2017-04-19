/**
 * Created by ZHL on 2016/4/7.
 */
'use strict';

angular.module('eayun.net')
    .controller('NetFloatListCtrl', ['SysCode','toast','eayunModal','floatService',function (SysCode,toast,eayunModal,floatService) {
        var vm = this;
        vm.search = '';
        vm.options = {
            searchFn: function () {
                vm.floatTable.api.draw();
            },
            select: [{ip: 'IP'},{prjName: '项目'},{cusName: '客户'}],
            series: {
                cusName: {
                    multi: true,
                    data: function () {
                        return floatService.getAllCustomerList().then(function (response) {
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
                        return floatService.getAllProjectList().then(function (response) {
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
        floatService.getAllDcList().then(function (data) {
            vm.dcList = data;
        });
        vm.datacenterId = '';
        vm.floatTable = {
            api: {},
            source: '/api/ecmc/virtual/floatip/getFloatIpList',
            getParams: function () {
                if(vm.search.key=='ip'){
                    return{
                        datacenterId : vm.datacenterId,
                        ip : vm.search.value
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
        vm.query = function(){
            vm.floatTable.api.draw();
        };
        vm.getIpForPrj = function(){
            var result = eayunModal.dialog({
                showBtn: false,
                title: '分配弹性公网IP给项目',
                width: '600px',
                templateUrl: 'controllers/net/float/prjip/prjip.html',
                controller: 'PrjIPCtrl',
                controllerAs: 'prjip',
                resolve: {
                }
            });
            result.then(function (_item) {
                floatService.allocateIptonum(_item).then(function(data){
                    if(data.respCode == SysCode.success){
                        toast.success('分配弹性公网IP成功');
                    }else{
                        eayunModal.error('分配弹性公网IP失败');
                    }
                    vm.floatTable.api.draw();
                }, function () {
                    vm.floatTable.api.draw();
                });
            });
        };
        /**绑定*/
        vm.bind = function(floId,prjId){
            var result = eayunModal.dialog({
                showBtn: true,
                title: '绑定',
                width: '600px',
                templateUrl: 'controllers/net/float/bind/bind.html',
                controller: 'BindCtrl',
                controllerAs: 'bindip',
                resolve: {
                    floId: function(){
                        return floId;
                    },
                    prjId: function(){
                        return prjId;
                    }
                }
            });
            result.then(function (_params) {
                floatService.bind(_params).then(function(data){
                    if(data.respCode == SysCode.success){
                        toast.success('弹性公网IP绑定资源成功');
                    }else{
                        eayunModal.error('弹性公网IP绑定资源失败');
                    }
                    vm.floatTable.api.draw();
                });
            });
        };
        /**解绑*/
        vm.unBind = function(item){
            eayunModal.confirm('确定解绑该弹性公网IP吗？').then(function () {
                floatService.unBind(item).then(function(data){
                    if(data.respCode == SysCode.success){
                        toast.success('弹性公网IP解绑成功');
                    }else{
                        eayunModal.error('弹性公网IP解绑失败');
                    }
                    vm.floatTable.api.draw();
                });
            });
        };
        /**释放*/
        vm.release = function(dcId,prjId,floId,resourceId,floIp){
            floatService.checkFloWebSite({'floIp':floIp}).then(function(data){
                if(data.respCode == SysCode.success){
                    if(data.data){
                        var page1 = eayunModal.open({
                            templateUrl: 'controllers/net/deletethree.html',
                            controller: 'DeleteResourceInfo3',
                            controllerAs: 'delRes3',
                            resolve: {
                                name: function () {
                                    return floIp;
                                }
                            }
                        }).result;
                    }else{
                        var page1 = eayunModal.open({
                            templateUrl: 'controllers/net/deleteone.html',
                            controller: 'DeleteResourceInfo1',
                            controllerAs: 'delRes1',
                            resolve: {
                                name: function () {
                                    return floIp;
                                }
                            }
                        }).result;
                    }
                    page1.then(function () {
                        var page2 = eayunModal.open({
                            templateUrl: 'controllers/net/deletetwo.html',
                            controller: 'DeleteResourceInfo2',
                            controllerAs: 'delRes2',
                            resolve: {
                                name: function () {
                                    return floIp;
                                }
                            }
                        }).result;
                        page2.then(function () {
                            floatService.release(dcId,prjId,floId,resourceId,floIp).then(function(data){
                                if(data.respCode == SysCode.success){
                                    toast.success('释放弹性公网IP成功');
                                }else{
                                    eayunModal.error('释放弹性公网IP失败');
                                }
                                vm.floatTable.api.draw();
                            });
                        });
                    });
                }
            });

        };
        vm.floatStatusClass = [];
        /*获取vpn状态颜色框的颜色类*/
        vm.checkFloatStatus = function (floatIp, _index) {
            vm.floatStatusClass[_index] = '';
            if(floatIp.chargeState != '0'){
                return 'gray';
            }
            else if(null != floatIp.resourceId && floatIp.resourceId != 'null' && floatIp.resourceId != ''){
                return 'green'
            }
            else {
                return 'space';
            }

        };
    }]);