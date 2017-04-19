/**
 * Created by eayun on 2016/4/25.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('CloudhostHostCreateCtrl', ['$modalInstance', 'eayunModal', 'HomeCommonService', 'HostService', 'toast', function ($modalInstance, eayunModal, HomeCommonService, HostService, toast) {
        var vm = this;

        vm.vmModel = {};
        vm.vmMaxlength = 20;
        vm.vmModel.number = 1;
        vm.configQuota = {};
        var configQuotaOption = ['云主机数量', '云硬盘数量', 'CPU', '内存', '云硬盘容量'];
        var newDisk = 0;
        vm.vmTypeIsSure = false;
        vm.configQuotaMessage = '';
        vm.step = 1;

        vm.cpu = {};
        vm.ram = {};

        /* step 1 */

        HomeCommonService.getDcList().then(function (data) {
            vm.dcList = data;
        });

        vm.changeDC = function (_dcId) {
            vm.vmModel.dcId = _dcId;
            vm.project = {};
            vm.vmModel.prjId = '';
            vm.checkVmNameFlag = true;
            HostService.getProListByDcId(_dcId).then(function (data) {
                vm.prjList = data;
            });
            checkConfigQuota();
        };

        vm.changePrj = function (_prjId, _cusId) {
            vm.vmModel.prjId = _prjId;
            vm.subnet = {};
            vm.vmModel.netId = '';
            vm.vmModel.subnetId = '';
            vm.checkVmName(vm.vmModel);
            HostService.getSubNetListByPrjId(_prjId).then(function (data) {
                vm.subnetList = data;
            });
            HostService.getModelListByCustomer(_cusId).then(function (data) {
                vm.vmTypeList = data;
            });
            checkConfigQuota();
        };

        vm.changeSubnet = function (_subnet) {
            vm.vmModel.netId = _subnet.netId;
            vm.vmModel.subnetId = _subnet.subnetId;
        };

        vm.formatForSubnetName = function(text){
            if(text.indexOf('(')>12){
                text = text.substr(0,12) + '...' + text.substr(text.indexOf('('));
            }
            return text;
        };

        vm.checkVmName = function (_vmModel) {
            /*if (_vmModel.vmName === undefined) {
                console.log(_vmModel.vmName);
                _vmModel.vmName = '';
            }*/
            HostService.checkVmName(_vmModel).then(function (data) {
                vm.checkVmNameFlag = data;
            });
        };

        vm.changeVmType = function () {
            vm.vmTypeIsSure = true;
            if (vm.vmType == '-1') {
                vm.cpu = {};
                vm.ram = {};
                vm.vmModel.cpus = 0;
                vm.vmModel.rams = 0;
                HostService.getCpuList().then(function (data) {
                    vm.cpuList = data;
                });
            } else {
                vm.vmModel.cpus = vm.vmType.modelVcpus;
                vm.vmModel.rams = vm.vmType.modelRam / 1024;
            }
            if (vm.vmModel.vmFrom != undefined) {
                getImageList();
            }
            checkConfigQuota();
        };

        vm.changeCpu = function () {
            vm.vmModel.cpus = vm.cpu.nodeName.substr(0, vm.cpu.nodeName.length - 1);
            vm.ram = {};
            vm.vmModel.rams = '';
            HostService.getRamListByCpu(vm.cpu.nodeId).then(function (data) {
                vm.ramList = data;
            });
            getImageList();
            checkConfigQuota();
        };

        vm.changeRam = function () {
            vm.vmModel.rams = vm.ram.nodeName.substr(0, vm.ram.nodeName.length - 2);
            getImageList();
            checkConfigQuota();
        };

        vm.checkVmNum = function () {
            if (vm.vmModel.number == undefined) {
                vm.vmModel.number = '';
            } else if (vm.vmModel.number == 1) {
                vm.vmMaxlength = 20;
            } else if (vm.vmModel.number > 1 && vm.vmModel.number < 10) {
                vm.vmMaxlength = 18;
                vm.vmModel.dataCapacity = '';
            } else if (vm.vmModel.number >= 10) {
                vm.vmMaxlength = 17;
                vm.vmModel.dataCapacity = '';
            }
            checkConfigQuota();
        };

        vm.changeCapacity = function () {
            var regExp = new RegExp('^([5-9]|[1-9][0-9]{1,2}|1[0-9][0-9][0-9]|20[0-3][0-9]|204[0-8])$');
            if (vm.vmModel.dataCapacity != '' && regExp.test(vm.vmModel.dataCapacity)) {
                newDisk = 1;
            } else {
                newDisk = 0;
            }
            checkConfigQuota();
        };

        /* step 2 */

        vm.getImageListByVmFrom = function (_vmModel) {
            vm.image = {};
            _vmModel.fromImageId = '';
            getImageList();
        };

        HostService.getOsList().then(function (data) {
            vm.osList = data;
        });

        vm.changeSysType = function (_osId) {
            vm.vmModel.sysType = '';
            vm.imageList = [];
            switch (vm.vmModel.osType) {
                case '0007002002001':
                    vm.vmModel.disks = 60;
                    vm.vmModel.username = 'Administrator';
                    break;
                case '0007002002002':
                    vm.vmModel.disks = 20;
                    vm.vmModel.username = 'root';
                    break;
            }
            HostService.getSysTypeListByOs(_osId).then(function (data) {
                vm.sysTypeList = data;
            });
            checkConfigQuota();
        };

        vm.getImageListBySysType = function (_vmModel) {
            vm.image = {};
            _vmModel.fromImageId = '';
            getImageList();
        };

        vm.changeImage = function (_imageId) {
            vm.vmModel.fromImageId = _imageId;
        };

        var getImageList = function () {
            if (vm.vmModel.prjId && vm.vmModel.sysType && vm.vmModel.vmFrom && vm.vmModel.cpus && vm.vmModel.rams && vm.vmModel.disks) {
                HostService.getImageList(vm.vmModel).then(function (data) {
                    vm.imageList = data;
                });
            }
        };

        var checkConfigQuota = function () {
            if (!angular.equals(vm.project, {}) && vm.project.projectId) {
                var messageArray = [], configQuota = 0;
                vm.configQuota.totalNumber = vm.project.hostCount;
                vm.configQuota.usedNumber = vm.project.usedVmCount + 1 * vm.vmModel.number;
                vm.configQuota.totalDisk = vm.project.diskCount;
                vm.configQuota.usedDisk = vm.project.diskCountUse + 1 * vm.vmModel.number + newDisk;
                vm.configQuota.totalCpu = vm.project.cpuCount;
                vm.configQuota.usedCpu = vm.project.usedCpuCount + vm.vmModel.number * (vm.vmTypeIsSure/*!angular.equals(vm.cpu, {})*/ ? vm.vmModel.cpus : 0);
                vm.configQuota.totalRam = vm.project.memory / 1024;
                vm.configQuota.usedRam = (vm.project.usedRam / 1024 + vm.vmModel.number * ((vm.vmTypeIsSure/* || !angular.equals(vm.ram, {})*/) ? vm.vmModel.rams : 0));
                vm.configQuota.totalDiskCapacity = vm.project.diskCapacity;
                vm.configQuota.usedDiskCapacity = vm.project.usedDataCapacity + vm.vmModel.number * (vm.vmModel.dataCapacity || 0) + vm.vmModel.number * (vm.vmModel.disks || 0 );

                if (vm.configQuota.usedNumber > vm.configQuota.totalNumber) {
                    configQuota++;
                    //messageArray.push(configQuotaOption[0]);
                }
                if (vm.configQuota.usedDisk > vm.configQuota.totalDisk) {
                    configQuota++;
                    messageArray.push(configQuotaOption[1]);
                }
                if (vm.configQuota.usedCpu > vm.configQuota.totalCpu) {
                    configQuota++;
                    messageArray.push(configQuotaOption[2]);
                }
                if (vm.configQuota.usedRam > vm.configQuota.totalRam) {
                    configQuota++;
                    messageArray.push(configQuotaOption[3]);
                }
                if (vm.configQuota.usedDiskCapacity > vm.configQuota.totalDiskCapacity) {
                    configQuota++;
                    messageArray.push(configQuotaOption[4]);
                }
                if (messageArray.length > 0 || configQuota > 0) {
                    vm.configQuotaFlag = true;
                    vm.configQuotaMessage = messageArray.join('、') + '超过项目上限';
                } else {
                    vm.configQuotaFlag = false;
                    vm.configQuotaMessage = '';
                }
            } else {
                vm.configQuota.totalNumber = 0;
                vm.configQuota.usedNumber = 0;
                vm.configQuota.totalDisk = 0;
                vm.configQuota.usedDisk = 0;
                vm.configQuota.totalCpu = 0;
                vm.configQuota.usedCpu = 0;
                vm.configQuota.totalRam = 0;
                vm.configQuota.usedRam = 0;
                vm.configQuota.totalDiskCapacity = 0;
                vm.configQuota.usedDiskCapacity = 0;
            }
        };

        vm.checkPassword = function () {
            var numFlag = 0;
            var lowerCharFlag = 0;
            var upperCharFlag = 0;
            var specCharFlag = 0;
            var pwd = vm.vmModel.password;
            var regex = new RegExp("^[0-9a-zA-Z~@#%+-=\/\(_\)\*\&\<\>\[\\]\\\\\"\;\'\|\$\^\?\!.\{\}\`/\,]{8,30}$");
            var regexNum = new RegExp("^[0-9]$");
            var regexLowerChar = new RegExp("^[a-z]$");
            var regexUpperChar = new RegExp("^[A-Z]$");
            var regexSpecChar = new RegExp("^[~@#%+-=\/\(_\)\*\&\<\>\[\\]\\\\\"\;\'\|\$\^\?\!.\{\}\`/\,]$");
            if (pwd && regex.test(pwd)) {
                for (var i = 0; i < pwd.length; i++) {
                    if (pwd[i] && regexNum.test(pwd[i])) {
                        numFlag = 1;
                        continue;
                    }
                    else if (pwd[i] && regexLowerChar.test(pwd[i])) {
                        lowerCharFlag = 1;
                        continue;
                    }
                    else if (pwd[i] && regexUpperChar.test(pwd[i])) {
                        upperCharFlag = 1;
                        continue;
                    }
                    else if (pwd[i] && regexSpecChar.test(pwd[i])) {
                        specCharFlag = 1;
                        continue;
                    }
                }
            }
            vm.checkPasswordFlag = (numFlag + lowerCharFlag + upperCharFlag + specCharFlag) < 3;
        };

        vm.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        vm.next = function () {
            vm.step++;
        };

        vm.back = function () {
            vm.step--;
        };

        vm.done = function () {
            eayunModal.confirm('云主机已设置正确，立即创建？').then(function () {
                $("#loadingBar").show();
                HostService.createVm(vm.vmModel).then(function () {
                    if (vm.vmModel.number == 1) {
                        var name = vm.vmModel.vmName.length > 8 ? vm.vmModel.vmName.substr(0, 5) + '...' : vm.vmModel.vmName;
                        toast.success('云主机' + name + '正在创建中');
                    } else if (vm.vmModel.number > 1) {
                        toast.success('批量添加的' + vm.vmModel.number + '台云主机创建中');
                    }
                    $modalInstance.close(true);
                    $("#loadingBar").hide();
                });
            });
        }
    }]);