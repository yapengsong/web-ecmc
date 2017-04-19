/**
 * Created by eayun on 2016/4/29.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('CloudhostHostMountDiskCtrl', ['vmModel', 'unBindDiskList', 'maxDiskCount', 'diskCount', '$scope', 'HostService', 'eayunModal', 'toast', function (vmModel, unBindDiskList, maxDiskCount, diskCount, $scope, HostService, eayunModal, toast) {
        var vm = this;

        vm.vmModel = vmModel;
        vm.unBindDiskList = unBindDiskList;
        vm.maxDiskCount = maxDiskCount;                             //可以绑定云硬盘数的最大值
        vm.diskCount = diskCount;                                   //已经绑定的云硬盘数
        vm.diskCountToBindOrigin = vm.maxDiskCount - vm.diskCount;  //初始可以绑定的云硬盘数
        vm.diskCountToBind = vm.diskCountToBindOrigin;              //操作以后可以绑定的云硬盘数
        //vm.btnCheck = false;//false开启确定按钮，true关闭确定按钮

        /*HostService.getDiskCountByVm(vm.vmModel.vmId).then(function (data) {
         vm.diskCount = data;
         vm.diskCountToBindOrigin = vm.maxDiskCount - vm.diskCount;
         vm.diskCountToBind = vm.diskCountToBindOrigin;
         });*/

        vm.isAllChecked = false;
        var checkedVolIds = [];

        vm.updateSelection = function ($event, volId) {
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            updateSelected(action, volId);
        };

        var updateSelected = function (action, volId) {
            if (action == 'add' && checkedVolIds.indexOf(volId) == -1) {
                checkedVolIds.push(volId);
                vm.diskCountToBind--;
                if (checkedVolIds.length == vm.unBindDiskList.length) {
                    vm.isAllChecked = true;
                }
            }
            if (action == 'remove' && checkedVolIds.indexOf(volId) != -1) {
                var index = checkedVolIds.indexOf(volId);
                checkedVolIds.splice(index, 1);
                vm.diskCountToBind++;
                if (checkedVolIds.length == vm.unBindDiskList.length - 1) {
                    vm.isAllChecked = false;
                }
            }
        };

        vm.checkAll = function () {
            if (vm.isAllChecked) {
                checkedVolIds = [];
                angular.forEach(vm.unBindDiskList, function (value) {
                    value.isChecked = vm.isAllChecked;
                    checkedVolIds.push(value.volId);
                    //vm.diskCountToBind--;
                });
                vm.diskCountToBind = vm.maxDiskCount - vm.unBindDiskList.length - vm.diskCount;
            } else {
                checkedVolIds.splice(0, checkedVolIds.length);
                angular.forEach(vm.unBindDiskList, function (value) {
                    value.isChecked = vm.isAllChecked;
                });
                vm.diskCountToBind = vm.maxDiskCount - vm.diskCount;
            }
        };

        vm.commit = function () {
            //vm.btnCheck = true;
            var bindDiskList = [];
            angular.forEach(vm.unBindDiskList, function (value) {
                angular.forEach(checkedVolIds, function (id) {
                    if (value.volId == id) {
                        var item = {
                            vmId: vm.vmModel.vmId,
                            vmName:vm.vmModel.vmName,
                            dcId: value.dcId,
                            prjId: value.prjId,
                            volId: value.volId,
                            volName:value.volName
                        };
                        bindDiskList.push(item);
                    }
                });
            });
            if(bindDiskList.length == 0){
                eayunModal.warning('请选择挂载的云硬盘');
                return;
            }
            HostService.getDiskCountByVm(vm.vmModel.vmId).then(function (data) {
                vm.diskCount = data;
                vm.diskCountToBindOrigin = vm.maxDiskCount - vm.diskCount;
                vm.diskCountToBind = vm.diskCountToBindOrigin;

                if(vm.diskCount && vm.diskCount <5){
                    if (bindDiskList.length + vm.diskCount > vm.maxDiskCount) {
                        eayunModal.warning('最多可挂载4块数据盘，选择块数不能超过' + (vm.maxDiskCount - vm.diskCount));
                        //vm.btnCheck = false;
                        return;
                    }
                    HostService.bindBatchVolume(bindDiskList).then(function (data) {
                        if(data && data.suCount == bindDiskList.length){
                            toast.success('云硬盘挂载中');
                        }
                        else{
                            eayunModal.warning('成功挂载了'+data.suCount+'块盘，'+(bindDiskList.length-data.suCount)+'块挂载失败；若云主机正在创建自定义镜像，请稍候重试。');
                        }
                        $scope.ok();
                    }, function (message) {
                        eayunModal.warning(message)
                        //vm.btnCheck = false;
                    });
                }
                else if(vm.diskCount >=5){
                    eayunModal.warning('可挂载的硬盘数量已满');
                    $scope.ok();
                }
            });

        };
    }]);