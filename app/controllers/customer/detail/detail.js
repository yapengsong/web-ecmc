/**
 * Created by eayun on 2016/3/24.
 */
'use strict'


angular.module('eayun.customer')
    .controller('CusDetailCtrl', ['eayunModal', '$state', 'CustomerService', '$stateParams', 'toast', 'SysCode', function (eayunModal, $state, CustomerService, $stateParams, toast, SysCode) {
        var that = this;
        that.cusId = $stateParams.cusId;
    }]);
