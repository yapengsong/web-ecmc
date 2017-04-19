/**
 * Created by ZHL on 2016/4/6.
 */
'use strict';

angular.module('eayun.ecmc').factory('CodeHandler', ['$q', 'SysCode', '$injector',
    function ($q, SysCode, $injector) {
        var CodeHandler = {};
        CodeHandler.response = function (response) {
            if (response.data.code) {
                var deferred = $q.defer();
                switch (response.data.code) {
                    case SysCode.error:
                        var eayunModal = $injector.get('eayunModal');
                        eayunModal.warning(response.data.message);
                        deferred.reject(response);
                        break;
                    case  SysCode.success:
                        deferred.resolve(response);
                        break;
                    default:
                        deferred.reject(response);
                        break;
                }
                return deferred.promise;
            } else {
                return $q.resolve(response);
            }
        };
        return CodeHandler;
    }]);