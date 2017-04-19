/**
 * Created by liyanchao on 2016/4/7.
 */
'use strict';

angular.module('eayun.net')
    .controller('NetBalancePoolCtrl', ['NetPoolService', '$http','toast','eayunModal','HomeCommonService',
        function (NetPoolService, $http,toast,eayunModal,HomeCommonService ) {
        var vm = this;
        /**查询资源池列表**/
        vm.dcResourceList = {};
        NetPoolService.getDcResourceList().then(function (response) {
            vm.dcResourceList = response.data;
        });

        vm.search = '';
        vm.options = {
            searchFn: function () {
                vm.table.api.draw();
            },
            select: [{poolName: '名称'}, {cusOrg: '客户'}, {prjName: '项目'}],
            series: {
                cusOrg: {
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

        vm.dcId = '';
        vm.table = {
            source: '/api/ecmc/virtual/loadbalance/pool/querypool',
            getParams: function () {
                var param = {};
                param[vm.search.key] = vm.search.value;
                param['dcId'] = vm.dcId;
                return param;
            },
            api: {},
            result: {}
        };
        //切换数据中心，刷新table
        vm.refreshTable = function (){
            vm.table.api.draw();
        };

        vm.getPoolStatus = function (_poolModel, _index) {
            vm.poolStatusClass[_index] = '';
            if (_poolModel.poolStatus == 'ACTIVE') {
                return 'green';
            }
            else if (_poolModel.poolStatus == 'ERROR') {
                return 'gray';
            }
            else if (_poolModel.poolStatus == 'PENDING_CREATE' || _poolModel.poolStatus == 'PENDING_UPDATE' || _poolModel.poolStatus == 'PENDING_DELETE') {
                return 'yellow';
            }
        };

        /**创建资源池**/
        vm.createPool = function () {
            var result = eayunModal.dialog({
                showBtn: true,
                title: '创建资源池',
                width: '600px',
                height: '300px',
                templateUrl: 'controllers/net/balance/pool/add/add.html',
                controller: 'NetBalanceAddPoolCtrl',
                controllerAs: 'add'
            });
            result.then(function (model) {
                var name = model.poolName.length>9?model.poolName.substr(0,9)+"...":model.poolName;
                var hint = "添加资源池" + name + "成功";
                toast.success(hint);
                vm.table.api.draw();
            }, function () {
                vm.table.api.draw();
            });
        };
        /**编辑资源池**/
        vm.editPool = function(pool){
            var result = eayunModal.dialog({
                showBtn: true,
                title: '编辑资源池',
                width: '600px',
                height: '300px',
                templateUrl: 'controllers/net/balance/pool/edit/edit.html',
                controller: 'NetBalanceEditPoolCtrl',
                controllerAs: 'edit',
                resolve: {
                    resourcePool:function(){
                        return pool;
                    }
                }

            });

            result.then(function (model) {
                var name = model.poolName.length>9?model.poolName.substr(0,9)+"...":model.poolName;
                var hint = "编辑资源池" + name + "成功";
                toast.success(hint);
                vm.table.api.draw();
            }, function () {
                vm.table.api.draw();
            });

        };
        /**资源池绑定弹性公网IP**/
        vm.bindFloatIp = function(resourcePool){
            var result = eayunModal.dialog({
                showBtn: true,
                title: '绑定弹性公网IP',
                width: '600px',
                height: '300px',
                templateUrl: 'controllers/net/balance/pool/bindfloatip/bindfloatip.html',
                controller: 'NetBalancePoolBindFloateIpCtrl',
                controllerAs: 'bindFloatIp',
                resolve: {
                    resourcePool:function(){
                        return resourcePool;
                    }
                }

            });

            result.then(function (model) {
                /*var name = model.poolName.length>9?model.poolName.substr(0,9)+"...":model.poolName;
                var hint = name +"绑定公网IP成功";*/
                toast.success("资源池绑定公网IP成功");
                vm.table.api.draw();
            }, function () {
                vm.table.api.draw();
            });

        };
        /**解绑公网ip**/
        vm.detachFloatIp = function(pool){
            eayunModal.confirm('确定要解绑浮动IP吗?').then(function () {
                NetPoolService.detachFloatIp(pool).then(function(){
                    toast.success('解绑浮动IP成功');
                    vm.table.api.draw();
                });
            });

        };
        /**绑定健康检查**/
        vm.bindLbMonitor = function(pool){

            var result = eayunModal.dialog({
                showBtn: true,
                title: '绑定健康检查',
                width: '600px',
                height: '300px',
                templateUrl: 'controllers/net/balance/pool/bindlbmonitor/bindlbmonitor.html',
                controller: 'NetBalancePoolBindLbMonitorCtrl',
                controllerAs: 'bindLbMonitor',
                resolve: {
                    resourcePool:function(){
                        return pool;
                    }
                }

            });

            result.then(function (model) {
                var name = model.poolName.length>9?model.poolName.substr(0,9)+"...":model.poolName;
                var hint = "资源池"+ name +"绑定健康检查成功";
                toast.success(hint);
                vm.table.api.draw();
            }, function () {
                vm.table.api.draw();
            });
        };

        /**解绑健康检查**/
        vm.detechLbMonitor = function(pool){
            var result = eayunModal.dialog({
                showBtn: true,
                title: '解绑健康检查',
                width: '600px',
                height: '300px',
                templateUrl: 'controllers/net/balance/pool/detechlbmonitor/detechlbmonitor.html',
                controller: 'NetBalancePoolDetechLbMonitorCtrl',
                controllerAs: 'detechLbMonitor',
                resolve: {
                    resourcePool:function(){
                        return pool;
                    }
                }

            });

            result.then(function (model) {
                var hint = "资源池解绑健康检查成功";
                toast.success(hint);
                vm.table.api.draw();
            }, function () {
                vm.table.api.draw();
            });
        };

        /**删除资源池**/
        vm.deletePool = function(pool){
            var name = pool.poolName.length>9?pool.poolName.substr(0,9)+'...':pool.poolName;
            eayunModal.confirm('确定要删除资源池'+name+'?').then(function () {
                NetPoolService.deletePool(pool).then(function(){
                    toast.success('删除资源池成功');
                    vm.table.api.draw();
                });
            });

        };
        /**详情*/
        vm.detail= function (pool) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '资源池详情',
                width: '900px',
                templateUrl: 'controllers/net/balance/pool/detail/detail.html',
                controller:'NetBalancePoolDetailCtrl',
                controllerAs:'detail',
                resolve:{
                    model:function () {
                        return pool;
                    }
                }
            });
        };

    }]);