/**
 * Created by eayun on 2016/4/4.
 */
'use strict'

angular.module('eayun.customer')
    .controller('CustomerProjectCtrl', ['$scope', 'CustomerService','project','dcList', 'eayunModal',
        function ($scope, CustomerService,project,dcList, eayunModal) {
        var vm =this;
        vm.dcList=dcList;
        vm.customer=angular.copy(project);
        vm.qtTemplate = {};
        vm.disableQtSelector = true;
        if(vm.customer.projectId==null){
            vm.customer.imageCount = 10;//系统默认自定义镜像数量为10
            $scope.showDis=true;
        }else{
            $scope.showDis=false;
        }
        $scope.commit = function (){
            $scope.ok(vm.customer);
        }
        vm.checkPrjInDc=function(dcId, cusId){
            CustomerService.checkPrjInDc(dcId, cusId).then(function (response) {
                vm.dcCanBeUsed = !response.data;
            });
        }

        function getQtTemplates(){
            CustomerService.getQtTemplateList().then(function(response){
                if(response.data.length > 0){
                    vm.disableQtSelector = false;
                    vm.qtTemplateList = response.data;
                }else{
                    vm.disableQtSelector = true;
                }
            });
        }

            if($scope.showDis){
                getQtTemplates();
            }


        vm.refreshTemplate = function(){
            if(vm.showTemSelector){
                getQtTemplates();
                vm.qtTemplateId = null;
            }
        }

        vm.selectQtTemplate = function(){
            CustomerService.getQtTemplateById(vm.qtTemplateId).then(function(response){
                if(response.data){
                    applyQtTemplate(response.data);
                }else{
                    vm.refreshTemplate();
                    eayunModal.error("该模板已被删除，请重新选择！");
                }

            })
        };

        function applyQtTemplate(qtTemplate) {
            vm.customer.cpuCount = qtTemplate.cpuCount;
            vm.customer.memory = qtTemplate.memory;
            vm.customer.hostCount = qtTemplate.hostCount;
            vm.customer.diskCount = qtTemplate.diskCount;
            vm.customer.diskSnapshot = qtTemplate.diskSnapshot;
            vm.customer.diskCapacity = qtTemplate.diskCapacity;
            vm.customer.snapshotSize = qtTemplate.snapshotSize;
            vm.customer.countBand = qtTemplate.countBand;
            vm.customer.netWork = qtTemplate.netWork;
            vm.customer.subnetCount = qtTemplate.subnetCount;
            vm.customer.outerIP = qtTemplate.outerIP;
            vm.customer.safeGroup = qtTemplate.safeGroup;
            vm.customer.quotaPool = qtTemplate.quotaPool;
            vm.customer.smsCount = qtTemplate.smsCount;
            vm.customer.countVpn = qtTemplate.countVpn;
            vm.customer.portMappingCount = qtTemplate.portMappingCount;
            vm.customer.imageCount = qtTemplate.imageCount;
        }

        vm.checkSGNum = function () {
            if(vm.customer.safeGroup<3){
                vm.customer.safeGroup = 3;
            }
        }
    }]);