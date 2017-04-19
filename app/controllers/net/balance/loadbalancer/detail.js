/**
 * Created by ZH.F on 2016/4/28.
 */
'use strict';

angular.module('eayun.net')
    .controller('LoadBalancerDetailCtrl', ['$scope', 'LoadBalancerService', '$stateParams', '$http', 'toast', 'eayunModal','$timeout', 'utils',
        function ($scope, LoadBalancerService, $stateParams, $http, toast, eayunModal,$timeout, utils) {
            var vm = this;

            vm.poolId = $stateParams.poolId;
            vm.pool = {};
            vm.poolStatusClass="";
            LoadBalancerService.getPoolById(vm.poolId).then(function(response){
                vm.pool = response.data.data;

                vm.setPoolStatusClass();
                vm.getMemberListByPoolId();
            });

            vm.init = function(){
                LoadBalancerService.getPoolById(vm.poolId).then(function(response){
                    vm.pool = response.data.data;

                    vm.setPoolStatusClass();
                    vm.getMemberListByPoolId();
                });
            };


            vm.members = {};
            vm.getMemberListByPoolId = function(){
                LoadBalancerService.getMemberListByPoolId(vm.pool.poolId).then(function(response){
                    vm.members = response.data.data;
                });
            };

            vm.setPoolStatusClass = function(){
                if(vm.pool.poolStatus && vm.pool.poolStatus=='ACTIVE'  && vm.pool.chargeState == '0'){
                    vm.poolStatusClass = 'green';
                }
                else if(vm.pool.poolStatus == 'ERROR' || vm.pool.chargeState != '0'){
                    vm.poolStatusClass = 'gray';
                }
                else if((vm.pool.poolStatus == 'PENDING_CREATE'|| vm.pool.poolStatus == 'PENDING_UPDATE' || vm.pool.poolStatus == 'PENDING_DELETE') && vm.pool.chargeState == '0'){
                    vm.poolStatusClass = 'yellow';
                }
            };
            vm.watchStatus = function(value){
                if(value!=='ACTIVE')
                    $timeout(vm.init,5000);
            };
            //刷新html状态
            $scope.$watch("vm.pool",function (newVal,oldVal){
                if(newVal !== oldVal){
                    var status= vm.pool.poolStatus.toString().toLowerCase();
                    if("active"!=status&&"error"!=status){
                        $timeout(vm.init,5000);
                    }
                }
            });

            vm.editPool = function(_pool){
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
                            return _pool;
                        }
                    }
                });
                result.then(function (model) {
                    var name = model.poolName.length>9?model.poolName.substr(0,9)+"...":model.poolName;
                    var hint = "编辑负载均衡器" + name + "成功";
                    toast.success(hint);
                    vm.init();
                }, function () {
                    vm.init();
                });
            };

            vm.bindMonitor = function(_pool){
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
                            return _pool;
                        }
                    }

                });
                result.then(function () {
                    vm.init();
                }, function () {
                    vm.init();
                });
            };

            vm.addMember = function(_resourcePool){
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
                result.then(function () {
                    var hint = "添加成员成功";
                    toast.success(hint);
                    vm.init();
                }, function () {
                    vm.init();
                });
            };

            vm.updateMember = function(_member){
                var result = eayunModal.dialog({
                    showBtn: true,
                    title: '编辑成员',
                    width: '650px',
                    templateUrl: 'controllers/net/balance/loadbalancer/editmember/editmember.html',
                    controller: 'LoadBalancerMemberEditController',
                    controllerAs:'editMember',
                    resolve: {
                        member: function () {
                            return _member;
                        }
                    }
                });
                result.then(function (data) {
                    var hint = "成员"+data.memberAddress+':'+data.protocolPort+"编辑成功";
                    toast.success(hint);
                    vm.init();
                }, function () {
                    vm.init();
                });
            };

            vm.deleteMember = function(_member){
                eayunModal.confirm('确定删除成员'+ _member.vmName+ '(' +_member.memberAddress+':'+_member.protocolPort+')?').then(function () {
                    $http.post('/api/ecmc/virtual/loadbalance/member/deleteMember',_member).then(function(response){
                        if(response&&response.data&&response.data.respCode=="000000"){
                            toast.success('删除成员成功');
                        }
                        vm.init();
                    });
                });
            };

            /*创建pool的提交*/
            $scope.commit = function () {
                var promise;
                promise = LoadBalancerService.editPool(vm.resourcePool);
                promise.then(function (data) {
                    $scope.ok(data);
                }, function () {
                    //eayunModal.error("保存失败", 500);
                });
            };
            /*将负载均衡器名称变为可编辑状态*/
            vm.editName = function () {
                vm.poolNameEditable = true;
                vm.hintNameShow = true;
                vm.checkPoolNameFlag = true;
                vm.editPool = angular.copy(vm.pool, {});
            };
            /*取消负载均衡器名称的可编辑状态*/
            vm.cancelEdit = function () {
                vm.poolNameEditable = false;
                vm.hintNameShow = false;
            };
            /*校验编辑负载均衡器名称是否存在*/
            vm.checkName = function () {
                    LoadBalancerService.checkPoolName(vm.editPool).then(function (response) {
                        vm.checkPoolNameFlag = !response.data.data;
                    });
            };
            /*保存编辑的负载均衡器名称,并刷新界面*/
            vm.saveEdit = function () {
                vm.poolNameEditable = false;
                vm.hintNameShow = false;
                LoadBalancerService.editPool(vm.editPool).then(function (data) {
                    toast.success("修改负载均衡器" + utils.ellipsis(vm.editPool.poolName, 8) + "成功");
                    vm.init();
                }, function (message) {
                    vm.init();
                    eayunModal.warning(message);
                });
            };
        }]);