/**
 * Created by ZHL on 2016/4/12.
 */
'use strict';

angular.module('eayun.ecmc')
    .controller('LoginCtrl', ['AuthService', '$state', 'loginInfo',
        function (AuthService, $state, loginInfo) {
            var vm = this;
            vm.random = Math.random();
            vm.login = function () {
                AuthService.login(vm.userName, vm.passWord, vm.captcha)
                    .then(function () {
                        return loginInfo.getSessionInfo().then(function (session) {
                            /** 登录后进入第一个可点的菜单 */
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
                        });
                    }, function (msg) {
                        vm.error = msg;
                        vm.captcha = '';
                        vm.changeCaptcha();
                    });
            };
            vm.changeCaptcha = function () {
                vm.random = Math.random();
            };
            vm.clicked = function () {
                var capital = false;
                var capitalTip = {
                    toggle: function (s) {
                        var d = vm.lastChart;
                        if (s) {
                            vm.lastChart = s;
                        } else {
                            vm.lastChart = d == false ? true : false;
                        }
                    }
                };
                vm.forbid = function ($event) {
                    if (capital) {
                        return
                    }
                    if ((( $event.charCode >= 65 && $event.charCode <= 90 ) && !$event.shiftKey)
                        || (( $event.charCode >= 97 && $event.charCode <= 122 ) && $event.shiftKey)) {
                        vm.lastChart = true;
                        capital = true;
                    } else {
                        vm.lastChart = false;
                    }
                    vm.capitaled = function ($event) {
                        if ($event.keyCode == 20) {
                            capitalTip.toggle();
                        }
                    };

                };
            };
        }]);