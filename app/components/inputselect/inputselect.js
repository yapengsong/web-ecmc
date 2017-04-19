/**
 * Created by eayun on 2016/4/24.
 */
'use strict'

angular.module('eayun.ui.components')
    .directive('eayunInputSelect', ['$timeout', '$document', function ($timeout, $document) {
        return {
            templateUrl: 'components/inputselect/inputselect.html',
            restrict: 'EA',
            replace: true,
            transclude: true,
            controller: function ($scope) {
                $scope.options = new Array();
                $scope.open = function () {
                    $scope.showMenu = !$scope.showMenu;
                };
                var curOption = null;
                var ngModelCtrl = '';
                var api = {
                    select: function (_option) {
                        curOption && (curOption.selected = false);
                        curOption = _option;
                        curOption.selected = true;
                        $scope.text = curOption.text;
                        $scope.showMenu = false;
                    },
                    addOption: function (_text, _value, _selected) {
                        var option = {
                            text: _text,
                            value: _value,
                            selected: _selected
                        };
                        if (ngModelCtrl && curOption && (option.value == curOption.value)) {
                            option.selected = true;
                        }
                        $scope.options.push(option);
                        option.selected && this.select(option);
                        return option;
                    },
                    getOptionByValue: function (_value) {
                        if (typeof _value === 'undefined') {
                            return {};
                        }
                        var option = null;
                        angular.forEach($scope.options, function (_option) {
                            if (_option.value == _value) {
                                option = _option;
                            }
                        });
                        return option || {value: null};
                    },
                    init: function (_ngModelCtrl) {
                        ngModelCtrl = _ngModelCtrl;
                        ngModelCtrl.$render = function () {
                            //var option = api.getOptionByValue(ngModelCtrl.$modelValue);
                            var option = {};
                            option.value = ngModelCtrl.$modelValue;
                            api.select(option);
                        };
                        ngModelCtrl.$parsers.unshift(
                            function (_newValue) {
                                var option = api.getOptionByValue(_newValue);
                                if (option.value == null) {
                                    option.value = '';
                                    option.text = _newValue;
                                }
                                api.select(option);
                                return _newValue;
                            }
                        );
                        $scope.$watch('text', function (_newV, _oldV) {
                            if (_newV !== _oldV) {
                                ngModelCtrl.$setViewValue(_newV);
                            }
                        });
                    }
                };
                return api;
            },
            scope: {
                name: '@',
                maxlength: '@',
                placeholder: '@',
                text: '@initialValue'
            },
            require: ['eayunInputSelect', '?ngModel'],
            link: function postLink(scope, element, attrs, ctrls) {
                var inputSelectCtrl = ctrls[0], ngModelCtrl = ctrls[1];
                if (ngModelCtrl) {
                    inputSelectCtrl.init(ngModelCtrl);
                }
                var documentClickBind = function () {
                    scope.$apply(function () {
                        scope.showMenu = false;
                    });
                };
                scope.$watch('showMenu', function (_value) {
                    if (_value) {
                        $timeout(function () {
                            $document.bind('click', documentClickBind);
                        }, 0, false);
                    } else {
                        $document.unbind('click', documentClickBind);
                    }
                });
            }
        };
    }])
    .directive('eayunInputOption', [function () {
        return {
            template: '<li data-ng-hide="option.selected"><a data-ng-bind="text"></a></li>',
            restrict: 'EA',
            replace: true,
            transclude: false,
            require: ['^eayunInputSelect', '?^ngModel'],
            scope: {
                text: '@'
            },
            link: function postLink(scope, element, attrs, ctrls) {
                var inputSelectCtrl = ctrls[0], ngModelCtrl = ctrls[1];
                var selected = angular.isDefined(attrs.selected);
                scope.value = scope.$parent.$eval(attrs.value);
                scope.option = inputSelectCtrl.addOption(scope.text, scope.value, selected);
                element.click(function () {
                    inputSelectCtrl.select(scope.option);
                    ngModelCtrl && ngModelCtrl.$setViewValue(scope.option.value);
                });
                if (selected && ngModelCtrl) {
                    ngModelCtrl.$setViewValue(scope.value);
                }
            }
        };
    }]);