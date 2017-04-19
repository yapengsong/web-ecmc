/**
 * Created by liyanchao on 2016/4/18.
 */
'use strict';

angular.module('eayun.net')
    .controller('NetBalanceAddMemberCtrl', ['$scope','NetMemberService', '$http','toast','eayunModal',function ($scope,NetMemberService, $http,toast,eayunModal ) {
        var vm = this;

        vm.lbMember={};

        vm.dcList = {};
        vm.prjList = {};
        vm.poolList = {};
        /**成员创建时便利与主机list**/
        vm.members = {};
        vm.poolSelected = {};

        /**获取数据中心list**/
        NetMemberService.getDcResourceList().then(function (response) {
            vm.dcList = response.data;
            vm.lbMember.prjId='';
        });

        /**根据dcId查询prjList**/
        vm.getProjectListByDcId = function(dcId){
            NetMemberService.getProjectListByDcId(dcId).then(function(response){
                vm.prjList = response.data;
            });
        };

        /**根据项目id查询所有资源池**/
        vm.getPoolListByPrjId = function (member){
            console.log(member);
            NetMemberService.getPoolListByPrjId(member).then(function(response){
                console.info(response);
                if(null!=response && null != response.data){
                    vm.poolList = response.data.data;
                }
            });
        };

        /**根据资源池绑定的子网去查拥有该子网的云主机**/
        vm.getVmListBySubnetId = function (subnetId) {
            NetMemberService.getVmListBySubnetId(subnetId).then(function(response){
                vm.members = response.data.data;
            });
        };

        /**
         * 校验选择项
         */
        vm.changeCheckMember = function (item){
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
                    vm.isErr = false;
                    var data ={
                        poolId:member.poolId,
                        memberAddress:member.memberAddress,
                        protocolPort:member.protocolPort,
                        vmId:member.vmId
                    };
                    $http.post('/api/ecmc/virtual/loadbalance/member/checkmemberport.do',data).then(function(response) {
                        if(response!='' && response.data.data==false){
                            member.isPortExsit = false;
                        }else{
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
                mem.poolId = vm.lbMember.poolId;
                mem.prjId = vm.lbMember.prjId;
                mem.dcId = vm.lbMember.dcId;
                if(mem.isCheck){
                    data[index++] = mem;
                }
            }
            return data;
        };

        /*创建Member的提交*/
        $scope.commit = function () {
            var promise;
            vm.memberList = vm.selectData();
            vm.lbMember.poolId = vm.poolSelected.poolId;
            vm.lbMember.memberList = vm.memberList;
            console.log(vm.lbMember);
            promise = NetMemberService.addMember(vm.lbMember);
            promise.then(function (data) {
                $scope.ok(data);
            }, function () {
                eayunModal.error("保存失败",500);
            });
        };




    }]);