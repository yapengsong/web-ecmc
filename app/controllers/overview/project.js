/**
 * Created by eayun on 2016/3/18.
 */
'use strict';

angular.module('eayun.overview')
    .controller('OverviewProjectCtrl', ['HomeCommonService', function (HomeCommonService) {
        var vm = this;
        vm.search = '';
        vm.options = {
            searchFn: function () {
                vm.table.api.draw();
            },
            select: [{customers: '客户'}, {prjs: '项目'}],
            series: {
                customers: {
                    multi: true,
                    data: function () {
                        return HomeCommonService.getAllCusOrgName();
                    }
                },
                prjs: {
                    multi: true,
                    data: function () {
                        return HomeCommonService.getAllPrjName();
                    }
                }
            }
        };
        vm.table = {
            source: '/api/ecmc/overview/getprjresourcelist',
            getParams: function () {
                var param = {};
                param[vm.search.key] = vm.search.value;
                return param;
                //return {};
            },
            api: {},
            result: {}
        };
    }])
    .directive('overviewPercent', [function () {
        return {
            restrict: 'EA',
            template: '<span ng-class="getClass()" ng-bind="::getStr()"></span>',
            replace: true,
            scope: {
                molecule: '=',
                denominator: '='
            },
            controller: 'OverviewPercentCtrl'
        };
    }])
    .controller('OverviewPercentCtrl', ['$scope', function ($scope) {
        $scope.getClass = function () {
            return ($scope.molecule / $scope.denominator) >= 0.8 ? 'color-error' : '';
        }
        $scope.getStr = function () {
            return $scope.molecule + '/' + $scope.denominator;
        };
    }]);