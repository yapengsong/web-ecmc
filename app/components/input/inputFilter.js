/**
 * Created by ZHL on 2016/5/4.
 */
'use strict';

angular.module('eayun.ui.components')
    /**
     * @ngdoc directive
     * @name eayunApp.directive:eayunInputFilter
     * @description
     * # eayunInputFilter
     * 输入框过滤
     */
    .directive('eayunInputFilter', ['$document', '$timeout', function ($document, $timeout) {
        return {
            templateUrl: 'components/input/inputFilter.html',
            restrict: 'EA',
            replace: true,
            scope: {
                placeholder: '@',
                filterData: '=',
                maxlength:'=',
                textField: '@'
            },
            require: 'ngModel',
            link: function postLink(scope, element, attrs, ngModelCtrl) {
                var map;
                function getMap() {
                    var map = {};
                    angular.forEach(scope.filterData, function (option) {
                        map[option[scope.textField]] = option;
                    });
                    return map;
                };
                function getKeys() {
                    var i;
                    scope.options = Object.keys(map);
                    scope.keys = scope.$eval('options | filter:(text===null?undefined:text)');
                    for (i = 0; i < scope.keys.length; i++) {
                        if(map[scope.keys[i]].$$selected){
                            scope.keys.splice(i,1);
                            break;
                        }
                    }
                };
                function init() {
                    map = getMap();
                    getKeys();
                };
                init();

                ngModelCtrl.$render = function () {
                    scope.text = ngModelCtrl.$modelValue;
                };
                scope.$watch('text', function (value) {
                    ngModelCtrl.$setViewValue(value);
                    getKeys();
                });
                scope.$watch('filterData', function (value) {
                    init();
                });
                scope.select = function (key, $event) {
                    scope.showMenu = false;
                    scope.text = key;
                    $event.stopPropagation();
                };
                scope.open = function () {
                    scope.showMenu = scope.disabled ? false : true;
                };
                attrs.$observe('disabled', function (value) {
                    scope.disabled = !!value;
                });
                var documentClickBind = function () {
                    scope.$apply(function () {
                        scope.showMenu = false;
                    });
                };
                scope.$watch('showMenu', function (value) {
                    if (value) {
                        $timeout(function () {
                            $document.bind('click', documentClickBind);
                        }, 0, false);
                    } else {
                        $document.unbind('click', documentClickBind);
                    }
                });
            }
        }
    }]);