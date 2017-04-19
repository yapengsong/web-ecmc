'use strict';

/**
 * @ngdoc directive
 * @name eayunApp.directive
 * @description
 * 页面组件模块
 */
angular.module('eayun.ui.components')
    /**
     * @ngdoc directive
     * @name eayunApp.directive:ajaxValid
     * @description
     * # tree
     * 树形控件
     */
    .directive('eayunAutoRefresh', ['$timeout', '$parse', function ($timeout, $parse) {
        return {
            restrict: 'EA',
            link: function postLink(scope, element, attrs) {
                var timer;
                var refresh = $parse(attrs.refresh)(scope);
                var interval = $parse(attrs.interval)(scope);
                interval = angular.isNumber(interval) ? parseInt(interval) : 5000;
                var flush = function () {
                    (refresh || angular.noop)();
                    timer = $timeout(flush, interval);
                };
                timer = $timeout(flush, 0);
                scope.$on('$destroy', function () {
                    $timeout.cancel(timer);
                });
            }
        };
    }]);

