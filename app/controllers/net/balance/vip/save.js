/**
 * Created by ZH.F on 2016/4/20.
 */
angular.module('eayun.net')
    .controller('VipSaveCtrl', ['$scope', 'vip','VipService', 'HomeCommonService', 'eayunModal',
        function ($scope, vip, VipService, HomeCommonService, eayunModal) {
            var vm = this;
            vm.vip = vip;
            vm.dcList = {};
            vm.prjList = {};
            vm.subnetList = {};
            vm.poolList = {};

            vm.getPoolAndSubnetListById = function(_dcId, _prjId){
                vm.getSubNetListByPrjId(_dcId, _prjId);
                vm.getPoolListByPrjId(_dcId, _prjId);
                vm.vip.poolName = '';
                vm.vip.subnetId = '';
            };
            vm.getSubNetListByPrjId= function(_dcId, _prjId){
                VipService.getSubNetListByPrjId(_dcId, _prjId).then(function(response){
                    vm.subnetList = response;
                    if(vm.subnetList.size>0) {
                        vm.subnetId = vm.subnetList[0].subnetId;
                    }
                });
            };

            vm.getPoolListByPrjId = function(_dcId, prjId){
                VipService.getPoolListByPrjId(_dcId, prjId).then(function(response){
                    console.log(response.data);
                    vm.poolList = response.data;
                    if(vm.poolList.size>0){
                        vm.poolName = vm.poolList[0].poolName;
                    }
                });
            };

            vm.getProjectListByDcId = function(_dcId){
                HomeCommonService.getPrjByDcId(_dcId).then(function(response){
                    vm.prjList = response;
                    vm.vip.prjId = '';
                    vm.vip.poolName = '';
                    vm.vip.subnetId = '';
                });
            };

            HomeCommonService.getDcList().then(function (response) {
                vm.dcList = response;
            });

            vm.setSubnetId = function(_poolList){
                for(var i=0; i<_poolList.length; i++){
                    if(vm.vip.poolName==_poolList[i].poolId){
                        vm.vip.subnetId = _poolList[i].subnetId;
                        console.info(vm.vip.subnetId);
                        break;
                    }
                }

            };

            vm.checkNameExist = function (){
                VipService.checkNameExist(vm.vip).then(function(response){
                    vm.checkName = response.data.data;
                });
            };

            vm.checkPortValid = function(){
                vm.portMsg="";
                var nameTest=/^(^[1-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)$/;

                var port = $("#protocalPort").val();
                if(!port.match(nameTest)){
                    vm.checkPort = true;
                    vm.portMsg="请输入1-65535的整数";
                }
            };

            $scope.commit = function () {
                var promise;
                if (vm.vip.vipId) {
                    var _vip = {
                        name: vm.vip.vipName || '',
                        connection_limit: vm.vip.connectionLimit || '',
                        admin_state_up:'1',
                        datacenterId: vm.vip.dcId,
                        projectId:vm.vip.prjId,
                        id:vm.vip.vipId
                    };
                    promise = VipService.editVip(_vip);
                } else {
                    var _vip = {
                        datacenter:vm.vip.dcId || '',
                        project: vm.vip.prjId ||'',
                        name: vm.vip.vipName || '',
                        protocol_port: vm.vip.protocolPort ||'',
                        subnet_id: vm.vip.subnetId || '',
                        pool_id: vm.vip.poolName ||'',
                        connection_limit: vm.vip.connectionLimit ||'',
                        admin_state_up:'1'
                    };
                    promise = VipService.createVip(_vip);
                }
                promise.then(function (data) {
                    $scope.ok(data);
                }, function (data) {
                    //eayunModal.error("保存失败",500);
                });
            };

        }]);