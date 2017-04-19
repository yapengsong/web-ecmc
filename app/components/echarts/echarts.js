/**
 * Created by ZHL on 2016/3/30.
 */
'use strict';

/**
 * @ngdoc directive
 * @name eayunApp.directive
 * @description
 * 页面组件模块
 */
angular.module('eayun.ui.components')
    .directive('echarts', [function () {
        var id = 0;
        return {
            restrict: 'A',
            scope: {
                echarts: '='
            },
            link: function postLink(scope, element, attrs) {
                id++;
                $(element).attr('id', 'echarts_' + id);
                scope.echarts = echarts.init(document.getElementById('echarts_' + id));
            }
        }
    }]);