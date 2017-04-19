'use strict'
angular.module('eayun.api')
    .controller('ApiManageCtrl', ['ApimanageService','eayunModal', 'SysCode','$scope', function (ApimanageService, eayunModal,SysCode,$scope) {
        var vm = this;
        vm.phone = '';
        ApimanageService.getApiSwitchPhone().then(function (response) {
            if (response.respCode == SysCode.success) {
                vm.phone = response.data;
            }
        });
        /**修改绑定手机-首先校验旧手机号；下一步>打开绑定新手机页面*/
        $scope.checkPhone = function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '修改手机号码',
                width: '600px',
                templateUrl: 'controllers/api/apimanage/checkPhone.html',
                controller: 'CheckPhoneCtrl',
                controllerAs: 'check',
                resolve: {
                    phone : function () {
                        return vm.phone;
                    }
                }
            })
            result.then(function () {
            },function(){
            });
        };
        /**未绑定时直接打开绑定修改页面*/
        $scope.editPhone = function () {
            var result = eayunModal.dialog({
                title: '绑定手机号码',
                width: '600px',
                templateUrl: 'controllers/api/apimanage/editPhone.html',
                controller: 'EditPhoneCtrl',
                controllerAs: 'edit',
                resolve: {
                    logType : function () {
                        return '0';
                    }
                }
            });
            result.then(function () {
            },function(){
            });
        };
    }]);