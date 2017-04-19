'use strict';

angular.module('eayun.ecmc')
    .factory('utils', function () {
        var utils = {};
        utils.ellipsis = function (str, length) {
            if (angular.isString(str) && angular.isNumber(length)) {
                return str.length > length ? str.substring(0, length) + '...' : str;
            }
            return str;
        };
        return utils;
    })
    .factory('eayunStorage', function () {
        var eayunStorage = {},
            storage = {};
        eayunStorage.set = function (key, value) {
            storage[key] = value;
        };
        eayunStorage.get = function (key) {
            return storage[key];
        };
        eayunStorage.delete = function (key) {
            delete storage[key];
            delete sessionStorage[key];
        };
        eayunStorage.persist = function (key, value) {
            if (value === undefined) {
                try {
                    return JSON.parse(sessionStorage[key]);
                } catch (e) {
                    return undefined;
                }

            } else {
                sessionStorage[key] = JSON.stringify(value);
            }
        };
        return eayunStorage;
    });
