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
     * # ajaxValid
     * ajax校验
     */
    .directive('ajaxValid', ['$q', '$log', function ($q, $log) {
        return {
            require: '?ngModel',
            scope: {
                ajaxValid: '&'
            },
            link: function postLink(scope, element, attrs, ngModel) {
                if (!ngModel) {
                    $log.error('ajaxValid 缺少 ngModel 指令');
                    return;
                }
                ngModel.$asyncValidators.ajaxValid = function (modelValue, viewValue) {
                    return $q.when(scope.ajaxValid({value: viewValue})).then(function (result) {
                        if (!result)
                            return $q.reject('');
                        return true;
                    });
                };
            }
        };
    }]);