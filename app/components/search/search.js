/**
 * Created by ZHL on 2016/3/17.
 */
'use strict';
angular.module('eayun.ui.components')
    /**
     * @ngdoc directive
     * @name eayunApp.directive:search
     * @description
     * # search
     * 搜索组件
     */
    .directive('eayunSearch', function () {
        return {
            templateUrl: 'components/search/search.html',
            restrict: 'EA',
            replace: true,
            controller: 'SearchCtrl',
            controllerAs: 'search',
            require: ['eayunSearch', 'ngModel'],
            scope: {
                options: '='
            },
            link: function postLink(scope, element, attrs, ctrl) {
                var searchCtrl = ctrl[0],
                    ngModel = ctrl[1];
                searchCtrl.init(ngModel, scope.options.searchFn, scope.options.select,
                    scope.options.series, scope.options.placeholder);
            }
        };
    })
    .controller('SearchCtrl', ['$injector', '$q', function ($injector, $q) {
        var vm = this;
        var ctrl = {
            parseSelectArray: function (select) {
                var selectArray = [];
                angular.forEach(select, function (item) {
                    angular.forEach(item, function (value, key) {
                        selectArray.push({
                            key: key,
                            value: value
                        });
                    });
                });
                return selectArray;
            },
            series: {},
            getSeries: function () {
                return vm.showSelectBtn ? ctrl.series[vm.selected] : ctrl.series;
            },
            setSeries: function (_series) {
                if (_series && Object.keys(_series).length > 0) {
                    if (vm.showSelectBtn) {
                        angular.forEach(_series, function (value, key) {
                            ctrl.series[key] = {};
                            ctrl.series[key].multi = !!value.multi;
                            $q.when($injector.invoke(value.data)).then(function (data) {
                                ctrl.series[key].data = data;
                            });
                        });
                    } else {
                        ctrl.series.multi = !!_series.multi;
                        $q.when($injector.invoke(_series.data)).then(function (data) {
                            ctrl.series.data = data;
                        });
                    }
                }
            }
        };
        vm.placeholder = "";
        /**
         *
         * @param _ngModel
         * @param _searchFn 查询回调函数
         * @param _select   搜索类型数组
         * @param _series     搜索项
         * @param _checkbox 是否显示checkbox
         */
        vm.init = function (_ngModel, _searchFn, _select, _series, _placeholder) {
            vm.placeholder = _placeholder;
            ctrl.ngModelCtrl = _ngModel;
            ctrl.ngModelCtrl.$render = function () {
                vm.value = ctrl.ngModelCtrl.$modelValue || '';
            };
            ctrl.searchFn = _searchFn;
            if (_select && _select instanceof Array && _select.length > 0) {
                vm.showSelectBtn = true;
                vm.selectArray = ctrl.parseSelectArray(_select);
                vm.selected = vm.selectArray[0].key;
            }
            ctrl.setSeries(_series);
            if (_series) {
                vm.hasFilter = true;
                vm.showFilter = false;
                vm.series = ctrl.getSeries();
            }
        };
        vm.doSearch = function () {
            var value = [];
            if (vm.hasFilter && vm.series && vm.series.multi) {
                //多选情况移除输入框末尾未选中项
                value = vm.value.split(',');
                value.pop();
                vm.value = value.length === 0 ? '' : (value.join(',') + ',');
            } else {
                value.push(vm.value);
            }
            if (vm.showSelectBtn) {
                ctrl.ngModelCtrl.$setViewValue({
                    key: vm.selected,
                    value: value.join(',')
                });
            } else {
                ctrl.ngModelCtrl.$setViewValue(value.join(','));
            }
            ctrl.searchFn();
        };
        vm.select = function (item) {
            if (vm.series.multi) {
                //多选
                if ((',' + vm.value).indexOf(',' + item + ',') !== -1) {
                    //    条目已选中，从搜索框中移除
                    vm.value = (',' + vm.value).replace(',' + item + ',', ',').replace(',','');
                } else {
                    //    条目未选中，加入搜索框
                    var array = vm.value.split(',');
                    var str = array.pop();
                    array.push(item);
                    array.push(str);
                    vm.value = array.join(',');
                }
            } else {
                //单选
                vm.showFilter = false;
                vm.value = item;
            }
        };
        vm.changeSelect = function () {
            if (vm.hasFilter) {
                vm.series = ctrl.getSeries();
            }
            vm.value = "";
        };
    }]);
