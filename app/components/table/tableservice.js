'use strict';
/**
 * @ngdoc service
 * @name eayunApp.components.tableService
 * @description
 * # tableService
 * tableService
 */
angular.module('eayun.ui.components')
    /**
     * @ngdoc service
     * @name eayunApp.tableService
     * @description
     * # tableService
     * tableService
     */
    .service('tableService', ['$http', function ($http) {
        var tableService = {};

        tableService.query = function (source, data) {
            return $http.post(source, data).then(function (response) {
                return response.data;
            });
        };

        tableService.queryPage = function (source, data) {
            return $http.post(source, data).then(function (response) {
                return response.data;
            });
        };

        return {
            query: tableService.query,
            queryPage: tableService.queryPage
        };
    }]);