/**
 * Created by eayun on 2016/4/4.
 */
'use strict'

angular.module('eayun.customer')
    .controller('CustomerPoolCtrl', ['CustomerService', 'pool', function (CustomerService, pool) {
        var vm=this;
        vm.prjPool=pool;
    }]);