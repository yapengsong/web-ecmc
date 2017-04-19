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
     * @name liadApp.toast
     * @description
     * # toast
     * 模态窗口服务
     */
    .service('toast', ['$modal', function ($modal) {
        var toast = function (type, msg) {
            return $modal.open({
                templateUrl: 'components/toast/toast.html',
                backdrop: false,
                controller: 'toastCtrl',
                resolve: {
                    msg: function () {
                        return msg;
                    },
                    type: function () {
                        return type;
                    }
                }
            }).result;
        };

        return {
            success: function (msg) {
                toast('success', msg);
            },
            error: function (msg) {
                toast('error', msg);
            },
            running: function (msg) {
                toast('running', msg);
            }
        };
    }])

    /**
     * @ngdoc function
     * @name eayunApp.controller:toastCtrl
     * @description
     * # toastCtrl
     * toast提示框
     */
    .controller('toastCtrl', ['$scope', '$modalInstance', '$timeout', 'msg', 'type', function ($scope, $modalInstance, $timeout, msg, type) {
        $scope.msg = msg;
        $scope.type = type;
        $scope.isIE = ("ActiveXObject" in window);//区分当前浏览器是否是IE
        $timeout(function () {
            $modalInstance.close(true);
        }, 2000, false);

    }]);