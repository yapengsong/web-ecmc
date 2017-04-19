/**
 * Created by ZHL on 2016/3/17.
 */
'use strict';

angular.module('eayun.ui.components')
    /**
     * @ngdoc directive
     * @name eayunApp.directive:eayunSelect
     * @description
     * # eayunSelect
     * 下拉选择组件
     */
    .directive('eayunSelectTree', ['$document', '$timeout', function ($document, $timeout) {
        return {
            templateUrl: 'components/select/selectTree.html',
            restrict: 'EA',
            replace: true,
            scope: {
                placeholder: '@',
                optionsData: '=',
                textField: '@',
                valueField: '@'
            },
            controller: 'eayunSelectCtrl',
            require: 'ngModel',
            link: function postLink(scope, element, attrs, ngModelCtrl) {
                scope.optionClick = function (data) {
                    scope.showMenu = false;
                    ngModelCtrl.$setViewValue(data.$option[scope.valueField]);
                };

                scope.open = function ($event) {
                    scope.showMenu = scope.disabled ? false : true;
                    $event.stopPropagation();
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

                scope.$watch('optionsData', function (value) {
                    ngModelCtrl.$render();
                });
                ngModelCtrl.$render = function () {
                    var item = getTreeItemByValue(ngModelCtrl.$modelValue, scope.valueField);
                    if (item) {
                        scope.select(item);
                    }
                };
                var isLeaf = function (item) {
                    return !item.children || !item.children.length;
                };

                var getTreeItemByValue = function (value, valueField) {
                    var items = [];
                    items = items.concat(scope.optionsData);
                    var curItem;
                    while (items.length > 0) {
                        curItem = items.pop();
                        if (!curItem) {
                            continue;
                        }
                        if (curItem && curItem[valueField] == value) {
                            return curItem;
                        } else if (!isLeaf(curItem)) {
                            items = items.concat(curItem.children)
                        }
                    }

                };
            }
        };
    }]);