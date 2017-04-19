/**
 * Created by eayun on 2016/4/19.
 */
'use strict'

angular.module('eayun.safe')
    .controller('SafeFirewallPolicyDetailCtrl', ['policyModel', function (policyModel) {
        var vm = this;

        vm.policyModel = policyModel;
    }]);