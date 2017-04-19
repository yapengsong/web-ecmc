'use strict';
/**
 * Created by ZHL on 2016/3/15.
 */
angular.module('eayun.ecmc')
    .controller('HomeHeaderCtrl', ['$timeout', 'loginInfo', 'warningMsg', 'WarningService', 'WorkorderService',
        'AuthService', '$state', 'eayunModal','HomeCommonService',
        function ($timeout, loginInfo, warningMsg, WarningService, WorkorderService,
                  AuthService, $state, eayunModal,HomeCommonService) {
            var vm = this;
            /** 定时刷新系统时间 */
            var getNowTime = function () {
                vm.today = vm.today + 1000;
                $timeout(getNowTime, 1000);

            };
            HomeCommonService.getFullTime().then(function(time){
                vm.today = time;
                $timeout(getNowTime, 1000);
            });

            loginInfo.getSessionInfo().then(function (session) {
                vm.userName = session.user.name;
                vm.parentId = "0007001002,0007001003";
                loginInfo.getSessionInfo().then(function () {
                    if(loginInfo.hasUIPermission("workorder_find_common")){//客服和运维
                        vm.parentId="0007001002";
                    }else if(loginInfo.hasUIPermission("workorder_find_special")){//商务
                        vm.parentId="0007001003";
                    }
                    /**获取待处理工单条数*/
                    WorkorderService.getWorkOrderCount(vm.parentId).then(function (response) {
                        vm.countMsg = response.data;
                    });
                });
            });

            /** 获取未处理的报警信息数量 */
            WarningService.getUnhandledAlarmMsgCount(warningMsg);
            vm.warningMsg = warningMsg;


            vm.password = function () {
                var result = eayunModal.dialog({
                    title: '修改密码',
                    width: '600px',
                    templateUrl: 'controllers/home/password.html',
                    controller: 'HomePasswordCtrl',
                    controllerAs: 'edit'
                });
                result.then(function () {
                    eayunModal.success("个人密码修改成功，请重新登录").then(vm.logout, vm.logout);
                });
            };

            vm.logout = function () {
                AuthService.logout();
            };


        }])
    .controller('HomeMenuCtrl', ['loginInfo', '$state', function (loginInfo, $state) {
        var vm = this;
        loginInfo.getSessionInfo().then(function (session) {
            vm.menus = session.menus;
            /** 如果当前不在任何菜单下，则跳转到第一个可点的菜单 */
            if ($state.is('app')) {
                var i, j, menus = session.menus;
                for (i = 0; i < menus.length; i++) {
                    if (menus[i].url) {
                        $state.go(menus[i].url);
                        return;
                    } else {
                        for (j = 0; j < menus[i].children.length; j++) {
                            if (menus[i].children[j].url) {
                                $state.go(menus[i].children[j].url);
                                return;
                            }
                        }
                    }
                }
            }
        });
        vm.isOpen = function (item) {
            var isOpen = false;
            angular.forEach(item.children, function (menu) {
                if ($state.includes(menu.url)) {
                    isOpen = true;
                }
            });
            return isOpen;
        };
    }]);