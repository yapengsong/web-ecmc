/**
 * Created by ZHL on 2016/3/22.
 */
'use strict';

angular.module('eayun.ui.components')
    .filter('multiFilter', ['$filter', function ($filter) {
        return function (data, text) {
            if (angular.isArray(data) && typeof text === 'string') {
                var select = text.split(',');
                var array = $filter('filter')(data, select.pop());
                var count = 0;
                for (var i = 0; i < array.length; i++) {
                    if ((',' + text).indexOf(',' + array[i] + ',') === -1) {
                        count++;
                        select.push(array[i]);
                    }
                }
                return select;
            } else {
                return data;
            }
        };
    }]);