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
    .directive('eayunSelect', ['$document', '$timeout', function ($document, $timeout) {
        return {
            templateUrl: function (element, attrs) {
                return attrs.type === 'btn' ? 'components/select/selectbtn.html' : 'components/select/select.html';
            },
            restrict: 'EA',
            replace: true,
            transclude: true,
            controller: function ($scope, $log) {
                $scope.options = new Array();
                $scope.selectFlag = false;
                $scope.open = function () {
                    $scope.showMenu = $scope.disabled ? false : !$scope.showMenu;
                };
                var getShowText = function (text) {
                    if (!text) {
                        return '';
                    } else if ($scope.showLength && text.length > $scope.showLength) {
                        return text.substr(0, $scope.showLength) + '...';
                    } else if ($scope.showFormat) {
                        return $scope.showFormat({text: text});
                    }
                    return text;
                };
                var curOption = null;
                var ngModelCtrl;
                var api = {
                    select: function (option) {
                        curOption && (curOption.selected = false);
                        curOption = option;
                        if (curOption.value != 'stay') {
                            curOption.selected = true;
                            $scope.text = getShowText(curOption.text);
                            $scope.textTip = curOption.text;
                        }
                        $scope.showMenu = false;
                        $scope.selectFlag = true;
                    },
                    addOption: function (value_, text_, selected_) {
                        var option = {
                            value: value_,
                            text: text_,
                            selected: selected_
                        };
                        if (ngModelCtrl && curOption && (option.value == curOption.value)) {
                            option.selected = true;
                            ngModelCtrl.$setValidity('outRange', true);
                        }
                        $scope.options.push(option);
                        option.selected && this.select(option);
                        return option;
                    },
                    removeOption: function (_option) {
                        for (var i = 0; i <= $scope.options.length; i++) {
                            if (_option === $scope.options[i]) {
                                $scope.options.splice(i, 1);
                                break;
                            }
                        }
                    },
                    getOptionByValue: function (value) {
                        if (typeof value === "undefined")
                            return {};
                        var option = null;
                        angular.forEach($scope.options, function (option_) {
                            if (option_.value == value) {
                                option = option_;
                            }
                        });
                        return option || {value: null};
                    },
                    init: function (ngModelCtrl_) {
                        ngModelCtrl = ngModelCtrl_;
                        ngModelCtrl.$render = function () {
                            var option = api.getOptionByValue(ngModelCtrl.$modelValue);
                            ngModelCtrl.$setValidity('outRange', option.value !== null);
                            //if (option.value === null)
                            //  $log.error(ngModelCtrl.$modelValue, '不在下拉选项之中！');
                            option.value = ngModelCtrl.$modelValue;
                            api.select(option);
                        };
                        ngModelCtrl.$parsers.unshift(
                            function (newValue) {
                                var option = api.getOptionByValue(newValue);
                                ngModelCtrl.$setValidity('outRange', option.value !== null);
                                return newValue;
                            }
                        );
                    }
                };
                return api;
            },
            scope: {placeholder: '@placeholder', showFormat: '&?'},
            require: ['eayunSelect', '?ngModel'],
            link: function postLink(scope, element, attrs, ctrls) {
                var selectCtrl = ctrls[0], ngModelCtrl = ctrls[1];
                if (ngModelCtrl) {
                    selectCtrl.init(ngModelCtrl);
                }
                if (attrs.showLength) {
                    var length = parseInt(attrs.showLength);
                    scope.showLength = length ? length : undefined;
                }

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
                attrs.$observe('disabled', function (value) {
                    scope.disabled = !!value;
                });
            }
        };
    }])
    /**
     * @ngdoc directive
     * @name eayunApp.directive:eayunOption
     * @description
     * # eayunOption
     * 下拉选项组件
     */
    .directive('eayunOption', [function () {
        return {
            template: '<li data-ng-hide="option.selected"><a data-ng-bind="text"></a></li>',
            restrict: 'EA',
            require: ['^eayunSelect', '?^ngModel'],
            scope: {
                text: '@'
            },
            replace: true,
            transclude: false,
            link: function postLink(scope, element, attrs, ctrls) {
                var selectCtrl = ctrls[0], ngModelCtrl = ctrls[1];
                var selected = angular.isDefined(attrs.selected);
                scope.value = scope.$parent.$eval(attrs.value);
                scope.option = selectCtrl.addOption(scope.value, scope.text, selected);
                element.click(function () {
                    selectCtrl.select(scope.option);
                    ngModelCtrl && ngModelCtrl.$setViewValue(scope.option.value);
                });
                if (selected && ngModelCtrl)
                    ngModelCtrl.$setViewValue(scope.value);
                scope.$on('$destroy', function () {
                    selectCtrl.removeOption(scope.option);
                });
            }
        };
    }]);