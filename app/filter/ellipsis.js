/**
 * Created by ZHL on 2016/4/28.
 */
'use strict'

angular.module('eayun.ecmc')
    .filter('ellipsis', [function () {
        return function (data, _length) {
            var length = parseInt(_length) || 20;
            if (data && data.length > length) {
                data = data + '';
                var l = data.length, size;
                if (l < 50) {
                    size = 'sm';
                } else if (l >= 50 && l < 100) {
                    size = 'md';
                } else {
                    size = 'bg';
                }
                var subStr = data.substr(0, length);
                var html = "<span class='ellipsis-span'>" +
                    subStr +
                    "<div class='detail-icon pointer ellipsis'>" +
                    "<div class='ellipsis-tip " + size + "'>" +
                    "<div class='triangle'></div>" +
                    data +
                    "</div>" +
                    "</div></span>";
                return html;
            } else {
                return data;
            }
            return data;
        }
    }]);