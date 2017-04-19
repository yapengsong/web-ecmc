/**
 * Created by eayun on 2016/5/4.
 */
'use strict'

angular.module('eayun.cloudhost')
    .controller('CloudhostHostDetailGuideCtrl', ['$stateParams', function ($stateParams) {
        var vm = this;

        vm.vmId = $stateParams.vmId;
    }]);