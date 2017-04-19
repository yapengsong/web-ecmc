'use strict';

/**
 * @ngdoc directive
 * @name eayunApp.directive
 * @description
 * ҳ�����ģ��
 */
angular.module('eayun.ui.components')
    /**
     * @ngdoc directive
     * @name eayunApp.directive:hint
     * @description
     * # hint
     * ð�ݿ�
     */
    .directive('hint', ['$templateRequest', '$compile', function ($templateRequest, $compile) {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $templateRequest(attrs.hint).then(function (template) {
                    var init = function () {
                        $(element).tooltip({
                            placement: attrs.tooltipPlacement || 'bottom',
                            html: true,
                            trigger: 'none',
                            title: $compile(template)(scope),
                            template: '<div class="tooltip ' + attrs.tooltipClass + '" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
                        });
                    };
                    var distroy = function () {
                        $(element).tooltip('destroy');
                    };
                    init();
                    scope.$watch(attrs.hintShow, function (show) {
                        init();
                        show ? $(element).tooltip('show') : distroy();
                    });
                });
            }
        }
    }]);