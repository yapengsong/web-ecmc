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
     * @name eayunApp.directive:inputCheck
     * @description
     * # inputCheck
     * 输入框在体现view值前校验的组件
     */
    .directive('inputCheck', [function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                check: '&inputCheck'
            },
            link: function postLink(scope, element, attrs, ngModel) {
                ngModel.$parsers.unshift(
                    function (newValue) {
                        var value = scope.check({value: ngModel.$modelValue, newValue: newValue});
                        ngModel.$setViewValue(value);
                        element.val(value);
                        return value;
                    }
                );
            }
        }
    }]);