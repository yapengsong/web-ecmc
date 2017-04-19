/**
 * Created by ZH.F on 2016/4/27.
 */

'use strict';

angular.module('eayun.net')
    .controller('LoadBalancerCtrl', ['LoadBalancerService', '$http','toast','eayunModal','HomeCommonService','$state','$scope','$timeout',
        function (LoadBalancerService, $http,toast,eayunModal,HomeCommonService,$state,$scope,$timeout) {
            var vm = this;
            /**查询资源池列表**/
            vm.dcList = {};
            HomeCommonService.getDcList().then(function (response) {
                vm.dcList = response;
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

           /* vm.watchStatus = function(value){
                if(value!=='ACTIVE')
                    $timeout(vm.refreshTable,5000);
            };*/
            //刷新html状态
            /*$scope.$watch("vm.table.result",function (newVal,oldVal){
                if(newVal !== oldVal){
                    if( vm.table.result!=null&& vm.table.result.length>0){
                        for(var i=0;i< vm.table.result.length;i++){
                            var status= vm.table.result[i].poolStatus.toString().toLowerCase();
                            if("active"!=status&&"error"!=status){
                                $timeout(vm.refreshTable,5000);
                                break;
                            }

                        }
                    }
                }
            });*/

            var timer;
            var refreshTable = function () {
                $timeout.cancel(timer);
                timer = $timeout(function () {
                    var keepgoing = true;
                    angular.forEach(vm.table.result, function (_pool) {
                        if ((_pool.poolStatus != 'ACTIVE' && _pool.poolStatus != 'ERROR') && keepgoing) {
                            vm.table.api.refresh();
                            keepgoing = false;
                        }
                    });
                }, 5000);
                timer.then(function () {
                    refreshTable();
                });
            };
            refreshTable();

            $scope.$on('$destroy', function () {
                $timeout.cancel(timer);
            });

            vm.getPoolStatus = function (_poolModel, _index) {
                vm.poolStatusClass[_index] = '';
                if (_poolModel.poolStatus == 'ACTIVE' && _poolModel.chargeState == '0') {
                    return 'green';
                }
                else if (_poolModel.poolStatus == 'ERROR' || _poolModel.chargeState != '0') {
                    return 'gray';
                }
                else if ((_poolModel.poolStatus == 'PENDING_CREATE' || _poolModel.poolStatus == 'PENDING_UPDATE' || _poolModel.poolStatus == 'PENDING_DELETE') && _poolModel.chargeState == '0') {
                    return 'yellow';
                }
            };

            /**创建资源池**/
            vm.createPool = function () {
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '创建负载均衡器',
                    width: '600px',
                    height: '300px',
                    templateUrl: 'controllers/net/balance/loadbalancer/add/add.html',
                    controller: 'LoadBalancerAddCtrl',
                    controllerAs: 'add'
                });
                result.then(function (model) {
                    var name = model.poolName.length>9?model.poolName.substr(0,9)+"...":model.poolName;
                    var hint = "添加负载均衡器" + name + "成功";
                    toast.success(hint);
                    vm.table.api.draw();
                }, function () {
                    vm.table.api.draw();
                });
            };
            /**编辑资源池**/
            vm.editPool = function(pool){
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '编辑负载均衡器',
                    width: '600px',
                    height: '300px',
                    templateUrl: 'controllers/net/balance/loadbalancer/edit/edit.html',
                    controller: 'LoadBalancerEditCtrl',
                    controllerAs: 'edit',
                    resolve: {
                        resourcePool:function(){
                            return pool;
                        }
                    }

                });

                result.then(function (model) {
                    var name = model.poolName.length>9?model.poolName.substr(0,9)+"...":model.poolName;
                    var hint = "编辑负载均衡器" + name + "成功";
                    toast.success(hint);
                    vm.table.api.draw();
                }, function () {
                    vm.table.api.draw();
                });

            };
            /**资源池绑定弹性公网IP**/
            vm.bindFloatIp = function(resourcePool){
                if(resourcePool.chargeState != '0'){
                    return ;
                }
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '绑定弹性公网IP',
                    width: '600px',
                    height: '300px',
                    templateUrl: 'controllers/net/balance/loadbalancer/bindfloatip/bindfloatip.html',
                    controller: 'LoadBalancerFloIpBindCtrl',
                    controllerAs: 'bindFloatIp',
                    resolve: {
                        resourcePool:function(){
                            return resourcePool;
                        }
                    }

                });

                result.then(function (model) {
                    vm.table.api.draw();
                }, function () {
                    vm.table.api.draw();
                });

            };
            /**解绑公网ip**/
            vm.unbundingFloatIp = function(resourcePool){
                if(resourcePool.chargeState != '0'){
                    return ;
                }
                eayunModal.confirm('确定要解绑'+resourcePool.poolName+'的公网IP吗?').then(function () {
                    LoadBalancerService.detachFloatIp(resourcePool).then(function(){
                        toast.success('解绑公网IP'+resourcePool.floatIp+'成功');
                        vm.table.api.draw();
                    });
                });

            };
            /**绑定健康检查**/
            vm.bindMonitor = function(pool){
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '健康检查',
                    width: '600px',
                    height: '300px',
                    templateUrl: 'controllers/net/balance/loadbalancer/bindhealthmonitor/bindhealthmonitor.html',
                    controller: 'LoadBalancerMonitorBindCtrl',
                    controllerAs: 'bindMonitor',
                    resolve: {
                        resourcePool:function(){
                            return pool;
                        }
                    }

                });

                result.then(function () {
                    vm.table.api.draw();
                }, function () {
                    vm.table.api.draw();
                });
            };

            /**
             * 删除负载均衡器
             */
            vm.deletePool = function(item){
                var page1 = eayunModal.open({
                    templateUrl: 'controllers/net/deleteone.html',
                    controller: 'DeleteResourceInfo1',
                    controllerAs: 'delRes1',
                    resolve: {
                        name: function () {
                            return item.poolName;
                        }
                    }
                }).result;
                page1.then(function () {
                    var page2 = eayunModal.open({
                        templateUrl: 'controllers/net/deletetwo.html',
                        controller: 'DeleteResourceInfo2',
                        controllerAs: 'delRes2',
                        resolve: {
                            name: function () {
                                return item.poolName;
                            }
                        }
                    }).result;
                    page2.then(function () {
                        $http.post('/api/ecmc/virtual/loadbalance/pool/deleteBalancer',item).then(function(response){
                            if(response&&response.data&&response.data.respCode=="000000"){
                                toast.success('删除负载均衡器成功');
                            }
                            vm.table.api.draw();
                        });
                    });
                });
            };

            vm.addMember = function(_resourcePool){
                if(_resourcePool.chargeState != '0'){
                    return ;
                }
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '添加成员',
                    width: '650px',
                    templateUrl: 'controllers/net/balance/loadbalancer/addmember/addmember.html',
                    controller: 'LoadBalancerMemberAddController',
                    controllerAs:'addMember',
                    resolve: {
                        resourcePool: function () {
                            return _resourcePool;
                        }
                    }
                });
                result.then(function (data) {
                    var hint = "添加成员成功";
                    toast.success(hint);
                    vm.table.api.draw();
                }, function () {
                    vm.table.api.draw();
                });
            };

            /**详情*/
            vm.detail= function (pool) {
                $state.go('app.net.loadDetail',{"poolId":pool.poolId});
            };

        }]);
