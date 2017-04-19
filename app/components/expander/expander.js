/**
 * Created by ZHL on 2016/3/17.
 */
'use strict';

angular.module('eayun.ui.components')
    .directive('accordion', [function () {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            template: '<div ng-transclude></div>',
            controller: function () {
                var vm = this;
                var api = {
                    expanders: [],

                    closeExpander: function (expander) {
                        //$(expander.target).removeClass('in');
                        $(expander.target).collapse('hide');
                    }
                };

                vm.addExpander = function (expander) {
                    api.expanders.push(expander);
                };

                vm.accordionOthers = function (selectedExpander) {
                    angular.forEach(api.expanders, function (expander) {
                        if (expander != selectedExpander) {
                            api.closeExpander(expander);
                            expander.active = false;
                        }
                    });
                };
            }
        }
    }])
    /**
     * @ngdoc directive
     * @name eayunApp.directive:expander
     * @description
     * # expander
     * 显示隐藏组件
     */
    .directive('expander', [function () {
        return {
            templateUrl: 'components/expander/expander.html',
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {
                target: '@'
            },
            require: '^?accordion',
            link: function postLink(scope, element, attrs, accordionCtrl) {
                var target = scope.target;
                scope.active = false;
                scope.show = angular.isDefined(attrs.expanderShow) && attrs.expanderShow == 'true';
                $(target).addClass("collapse");
                if (accordionCtrl != null) {
                    accordionCtrl.addExpander(scope);
                }
                if (scope.show) {
                    $(target).addClass("in");
                    //element.addClass("open");
                    scope.active = true;
                }
                /**用作配合项目右上方工单或报警触发点击事件的响应，尚未找到最佳方案，暂时注释*/
                /*attrs.$observe('expanderTrigger', function (value) {
                    if (value == 'true') {
                        scope.active = true;
                        $(target).collapse('show');
                        if (accordionCtrl != null) {
                            accordionCtrl.accordionOthers(scope);
                        }
                    }
                });*/
                element.click(function () {
                    //element.toggleClass("open");
                    scope.active = !scope.active;
                    if (accordionCtrl != null) {
                        accordionCtrl.accordionOthers(scope);
                    }
                });
            }
        };
    }]);