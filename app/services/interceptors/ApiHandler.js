/**
 * Created by ZHL on 2016/3/23.
 */
'use strict';

angular.module('eayun.ecmc')
    .factory('ApiHandler', ['$q', function ($q) {
        var ApiHandler = {};
        var pattern = /^\/api/;
        ApiHandler.request = function (config) {
            if (config.url.match(pattern)) {
                config.url = config.url + '.do';
            }
            return $q.when(config);
        };
        return ApiHandler;
    }]);
