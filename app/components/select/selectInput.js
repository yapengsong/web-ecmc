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
    .directive('eayunSelectInput', ['$document', '$timeout', function ($document, $timeout) {
        return {
            templateUrl: 'components/select/selectInput.html',
            restrict: 'EA',
            replace: true,
            scope: {
                placeholder: '@',
                optionsData: '=',
                textField: '@',
                valueField: '@',
                firstKey: '@'
            },
            controller: 'eayunSelectCtrl',
            require: 'ngModel',
            /*link: function postLink(scope, element, attrs, ngModelCtrl) {
             /!* keys for show *!/
             scope.curKeys = [];
             /!* options which has been selected or not *!/
             scope.curSelected = {};
             /!* K-V *!/
             var curOptions = {};
             scope.optionClick = function ($option, $event) {
             scope.showMenu = false;
             ngModelCtrl.$setViewValue(scope.value);
             };
             /!* override the select function *!/
             scope.select = function (key, $event) {
             scope.clear(key);
             scope.curSelected[key] = true;
             scope.text = key;
             scope.value = curOptions[key];
             (scope.optionClick || angular.noop)({
             $option: key,
             $event: $event
             });
             };
             /!* override the clear function *!/
             scope.clear = function(key){
             scope.curSelected = [];
             scope.value = null;
             };

             scope.open = function ($event) {
             scope.showMenu = scope.disabled ? false : true;
             };

             attrs.$observe('disabled', function (value) {
             scope.disabled = !!value;
             });
             /!* attrs cant-input determine the select-input component whether can be input to change its model value *!/
             scope.change = function () {
             if (!scope.cantInput) {
             ngModelCtrl.$setViewValue(scope.text);
             } else {
             ngModelCtrl.$setViewValue(scope.value);
             }
             };

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
             angular.forEach(scope.optionsData, function (option) {
             curOptions[option[scope.textField]] = option[scope.valueField];
             scope.curKeys.push(option[scope.textField]);
             if (option[scope.valueField] == ngModelCtrl.$modelValue) {
             scope.select(option[scope.textField]);
             }
             })
             };
             }*/
            link: function postLink(scope, element, attrs, ngModelCtrl) {
                var map;

                function getMap() {
                    var map = {};
                    angular.forEach(scope.optionsData, function (option) {
                        map[option[scope.textField]] = option;
                    });
                    return map;
                };
                function getKeys() {
                    var i;
                    scope.options = Object.keys(map);
                    scope.keys = scope.$eval('options | filter:text');
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
                scope.open = function () {
                    scope.showMenu = scope.disabled ? false : true;
                };
                scope.optionClick = function ($option, $event) {
                    scope.showMenu = false;
                    ngModelCtrl.$setViewValue(scope.value);
                    getKeys();
                };
                scope.click = function (key) {
                    scope.select(map[key]);
                };
                scope.change = function () {
                    ngModelCtrl.$setViewValue(scope.value);
                    scope.open();
                    getKeys();
                };

                attrs.$observe('disabled', function (value) {
                    scope.disabled = !!value;
                });
                var documentClickBind = function () {
                    scope.$apply(function () {
                        console.info('documentClickBind');
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
                    init();
                });

                ngModelCtrl.$render = function () {
                    angular.forEach(scope.optionsData, function (option) {
                        if (option[scope.valueField] == ngModelCtrl.$modelValue) {
                            scope.select(option);
                        }
                    })
                };
            }
        };
    }])
    .controller('eayunSelectCtrl', ['$scope', function ($scope) {
        var curOption = {};
        $scope.select = function (option, $event) {
            $scope.clear();
            option.$$selected = true;
            curOption = option;
            $scope.text = curOption[$scope.textField];
            $scope.value = curOption[$scope.valueField];
            $event && $event.stopPropagation();

            ($scope.optionClick || angular.noop)({
                $option: option,
                $event: $event
            });

        };
        $scope.clear = function () {
            curOption.$$selected = false;
            $scope.value = null;
            curOption = {};
        };
    }]);