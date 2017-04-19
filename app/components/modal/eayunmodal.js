'use strict';
/**
 * @ngdoc service
 * @name eayunApp.commonservice
 * @description
 * # commonservice
 * eayun公共服务
 */
angular.module('eayun.ui.components')
    /**
     * @ngdoc service
     * @name eayunApp.eayunModal
     * @description
     * # eayunModal
     * 模态窗口服务
     */
    .service('eayunModal', ['$modal', '$rootScope', function ($modal, $rootScope) {
        var eayunModal = {};

        //私有方法  默认项
        eayunModal.extendOptions = function (options) {
            var defaultOpt = {
                title: '',
                showBtn: true
            };
            return angular.extend(defaultOpt, options);
        };

        //私有方法  构造scope
        eayunModal.getScope = function (options) {
            var scope = (options.scope || $rootScope).$new();
            scope.title = options.title;
            scope.showBtn = options.showBtn;
            scope.width = (options.width || 0);
            return scope;
        };

        //原生$modal方法
        eayunModal.open = function (options) {
            return $modal.open(options);
        };

        //封装后的对话框方法
        eayunModal.dialog = function (options) {
            options = eayunModal.extendOptions(options);
            return $modal.open({
                template: '<eayun-dialog></eayun-dialog>',
                controller: 'EayunModalCtrl',
                backdrop: "static",
                scope: eayunModal.getScope(options),
                resolve: {
                    options: function () {
                        return options;
                    },
                    template: function ($templateRequest) {
                        return options.template ? $q.when(options.template) :
                            $templateRequest(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl);

                    }
                }
            }).result;
        };

        //封装后的确认框方法
        eayunModal.confirm = function (msg) {
            return $modal.open({
                templateUrl: 'components/modal/confirm.html',
                controller: 'EayunConfirmCtrl',
                resolve: {
                    msg: function () {
                        return msg;
                    },
                    type: function () {
                        return "confirm";
                    },
                    timeout: undefined
                }
            }).result;
        };

        //封装后的消息框方法
        eayunModal.alert = function (msg, type, timeout) {
            return $modal.open({
                templateUrl: 'components/modal/alert.html',
                controller: 'EayunConfirmCtrl',
                resolve: {
                    msg: function () {
                        return msg;
                    },
                    type: function () {
                        return type;
                    },
                    timeout: timeout
                }
            }).result;
        };
        eayunModal.successalert = function (msg) {
            return $modal.open({
                templateUrl: 'components/modal/alert.html',
                controller: 'EayunConfirmCtrl',
                resolve: {
                    msg: function () {
                        return msg;
                    },
                    type: function () {
                        return "success";
                    },
                    timeout: undefined
                }
            }).result;
        };
        return {
            open: eayunModal.open,
            dialog: eayunModal.dialog,
            confirm: eayunModal.confirm,
            info: function (msg, timeout) {
                return eayunModal.alert(msg, 'info', timeout);
            },
            warning: function (msg, timeout) {
                return eayunModal.alert(msg, 'warning', timeout);
            },
            error: function (msg, timeout) {
                return eayunModal.alert(msg, 'error', timeout);
            },
            success: function (msg, timeout) {
                return eayunModal.alert(msg, 'success', timeout);
            },
            successalert: eayunModal.successalert
        };
    }]);