/**
 * Created by eayun on 2016/4/19.
 */
'use strict'

angular.module('eayun.safe')
    .controller('SafeFirewallRuleDetailCtrl', ['fwRule', '$scope', function (fwRule, $scope) {
        var vm = this;
        vm.fwRule = fwRule;
    }]);