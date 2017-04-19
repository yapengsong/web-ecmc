/**
 * Created by ZH.F on 2016/4/28.
 */
'use strict';

angular.module('eayun.net')
    .controller('LoadBalancerMemberAddController', ['$scope', 'LoadBalancerService', 'resourcePool', '$http', 'toast', 'eayunModal',
        function ($scope, LoadBalancerService, resourcePool, $http, toast, eayunModal) {
            var vm = this;

            vm.resourcePool = resourcePool;

            vm.subnet = {};
            if(vm.resourcePool.subnetName&&vm.resourcePool.subnetIp){
                vm.subnet.subnetName = vm.resourcePool.subnetName;
                vm.subnet.cidr = vm.resourcePool.subnetCidr;
            }

            vm.members = {};
            LoadBalancerService.getMemeberListBySubnet(vm.resourcePool.subnetId).then(function(response){
                vm.members = response.data.data;
            });

            /**
             * 校验选择项
             */
            vm.changeCheckMember = function (item){
                vm.checkBtn = false;
                if(item.isCheck){
                    item.isEdit = true;
                    item.protocolPort = 80;
                    item.memberWeight = 10;
                }
                else{
                    item.isEdit = false;
                    item.protocolPort = null;
                    item.memberWeight = null;
                    item.isPortExsit = false;
                    item.isPortError = false;
                }
                item.isWeightError = null;
                vm.checkWeight(item);
                vm.checkPort(item);
                vm.checkSelected();
            };

            /**
             * 校验端口
             */
            vm.checkPort = function (member){
                member.isPortError = true;
                vm.showErrMsg =null;
                var regex=/^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/;
                if(member.isCheck){
                    if(member.protocolPort && regex.test(member.protocolPort)){
                        member.isPortError = false;
                        var data ={
                            poolId:vm.resourcePool.poolId,
                            memberAddress:member.memberAddress,
                            protocolPort:member.protocolPort,
                            vmId:member.vmId
                        };
                        $http.post('/api/ecmc/virtual/loadbalance/member/checkMemberExsit',data).then(function(response) {
                            if(response&&response.data&&response.data.data==true){
                                member.isPortExsit = false;
                            }
                            else{
                                vm.showErrMsg = '监听端口重复';
                                member.isPortExsit = true;
                                vm.isErr = true;
                            }
                            vm.checkError();
                        });
                    }
                    else{
                        vm.isErr = true;
                        vm.showErrMsg = '请输入1-65535的正整数！';
                    }
                }else{
                    member.isPortError = false;
                }
                vm.checkError();
            };

            /**
             * 校验权重
             */
            vm.checkWeight = function (item){
                item.isWeightError = true ;
                vm.showErrMsg =null;
                var regex=/^([1-9][0-9]{0,1}|100)$/;
                if(item.isCheck){
                    if(item.memberWeight && regex.test(item.memberWeight)){
                        item.isWeightError = false;
                        vm.isErr = false;
                    }
                    else{
                        vm.showErrMsg = '请输入1-100的正整数';
                        vm.isErr = true;
                    }
                }
                else{
                    item.isWeightError = false;
                    vm.isErr = false;
                }
                vm.checkError();
            };

            /**
             * 查询是否存在的选择项
             */
            vm.checkSelected = function (){
                vm.isSelected = false ;
                for(var i=0;i<vm.members.length;i++){
                    if(vm.members[i].isCheck){
                        vm.isSelected = true;
                        break;
                    }
                }
            };

            /**
             * 校验是否出错
             */
            vm.checkError = function (){
                vm.isTabErr = false ;
                for(var i=0;i<vm.members.length;i++){
                    if(vm.members[i].isCheck){
                        if(vm.members[i].isWeightError
                            ||vm.members[i].isPortExsit
                            ||vm.members[i].isPortError){
                            vm.isTabErr = true;
                            break;
                        }
                    }
                }
            };

            /**
             * 获取选择的数据
             */
            vm.selectData = function (){
                var data = [];
                var index = 0;
                for(var i=0;i<vm.members.length;i++){
                    var mem = vm.members[i];
                    if(mem.isCheck){
                        data[index++] ={
                            memberAddress:mem.memberAddress,
                            memberWeight:mem.memberWeight,
                            protocolPort:mem.protocolPort,
                            vmId:mem.vmId
                        };
                    }
                }
                return data;
            };

            /**
             * 确定
             */
            $scope.commit = function (){
                vm.checkBtn = true;
                var data = {
                    dcId:vm.resourcePool.dcId,
                    prjId:vm.resourcePool.prjId,
                    poolId:vm.resourcePool.poolId,
                    members:vm.selectData()
                };

                var promise;
                promise = LoadBalancerService.addMember(data);
                promise.then(function (data) {
                    $scope.ok(data);
                }, function () {
                    vm.checkBtn = false;
                    //eayunModal.error("保存失败", 500);
                });
            };

        }]);