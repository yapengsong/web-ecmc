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
    .directive('eyAssertSameAs', [function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function postLink(scope, element, attrs, ngModel) {
                var isSame = function (value) {
                    var anotherValue = scope.$eval(attrs.eyAssertSameAs);
                    return value === anotherValue;
                };
                ngModel.$validators.same = isSame;
                scope.$watch(function () {
                    return scope.$eval(attrs.eyAssertSameAs);
                }, function () {
                    ngModel.$setValidity('same', isSame(ngModel.$viewValue));
                })
            }
        };
    }]);

