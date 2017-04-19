/**
 * Created by eayun on 2016/4/7.
 */
'use strict'

angular.module('eayun.log')
    .controller('EcmcLogDetailCtrl', ['ecmclog', 'LogService', 'eayunModal',
        function (ecmclog, LogService, eayunModal) {
            var vm = this;
            LogService.getOperLog(ecmclog).then(function (data) {
                vm.ecmclog = data;
            }, function (message) {
                eayunModal.warning(message);
            });
        }]);