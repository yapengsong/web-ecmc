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
     * @name eayunApp.directive:dateTimePicker
     * @description
     * # dateTimePicker
     * 日期选择组件
     */
    .directive('dateTimePicker', [function () {
        return {
            templateUrl: 'template/datepicker/datetimepicker.html',
            restrict: 'EA',
            replace: true,
            controller: function ($scope) {
                $scope.status = {
                    opened: false
                };
                $scope.open = function () {
                    $scope.status.opened = true;
                };
                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1
                };
            },
            scope: {
                datepickerMode: '@',
                minMode: '@',
                dateDisabled: '=',
                customClass: '&',
                shortcutPropagation: '&?',
                format: '@',
                minDate: '=',
                maxDate: '='
            },
            require: '?ngModel',
            link: function postLink(scope, element, attrs, ngModel) {
                scope.showTime = angular.isDefined(attrs.showTime) ? scope.$parent.$eval(attrs.showTime) : false;
                scope.minMode = scope.minMode || 'day';
                scope.datepickerMode = scope.datepickerMode || 'day';
                if (!scope.format) {
                    scope.format = scope.showTime ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd';
                }
                if (ngModel) {
                    ngModel.$render = function () {
                        scope.value = ngModel.$modelValue;
                    };
                    scope.$watch('value', function () {
                        ngModel.$setViewValue(scope.value);
                    });
                }
                if (angular.isDefined(attrs.init)) {
                    var init = scope.$parent.$eval(attrs.init) || [0, 0, 0, 0, 0, 0];
                    var date = new Date();
                    scope.showTime || date.setHours(0, 0, 0, 0);
                    date.setFullYear((init[0] || 0) + date.getFullYear(), (init[1] || 0) + date.getMonth(), (init[2] || 0) + date.getDate());
                    date.setHours((init[3] || 0) + date.getHours(), (init[4] || 0) + date.getMinutes(), (init[5] || 0) + date.getSeconds(), 0);
                    scope.value = date;
                    ngModel && ngModel.$setViewValue(date);
                }

            }
        }
    }]);