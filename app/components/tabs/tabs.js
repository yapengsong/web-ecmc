/**
 * Created by ZHL on 2016/3/17.
 */
'use strict';

angular.module('eayun.ui.components')
    /**
     * @ngdoc directive
     * @name eayunApp.directive:tabs
     * @description
     * # tabs
     * 导航页签
     */
    .directive('tabs', [function () {
        return {
            template: '<nav><ul ng-transclude class="nav" role="tablist"></ul></nav>',
            restrict: 'EA',
            replace: true,
            transclude: true,
            link: function postLink(scope, element, attrs) {
                element.removeClass(attrs.class);
                element.children().addClass(attrs.class);
            }
        };
    }])
    /**
     * @ngdoc directive
     * @name eayunApp.directive:tab
     * @description
     * # tab
     * 导航页签项
     */
    .directive('tab', [function () {
        return {
            template: '<li role="presentation"><a ng-transclude role="tab"></a></li>',
            restrict: 'EA',
            replace: true,
            transclude: true,
            link: function postLink(scope, element, attrs) {

            }
        };
    }])
    /**
     * @ngdoc directive
     * @name eayunApp.directive:tabUnderline
     * @description
     * # tabUnderline
     * 导航页签项--下划线
     */
    .directive('tabUnderline', [function () {
        return {
            template: '<li role="presentation"><a ng-transclude role="tab"></a><div class="triangle"></div></li>',
            restrict: 'EA',
            replace: true,
            transclude: true,
            link: function postLink(scope, element) {

            }
        };
    }]);