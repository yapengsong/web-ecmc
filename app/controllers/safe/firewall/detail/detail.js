/**
 * Created by eayun on 2016/4/19.
 */
'use strict'

angular.module('eayun.safe')
    .controller('SafeFirewallDetailCtrl', ['fwModel', function (fwModel) {
        var vm = this;

        vm.fwModel = fwModel;
    }]);