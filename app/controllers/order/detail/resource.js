/**
 * Created by Administrator on 2016/9/28 0028.
 */

'use strict';
angular.module('eayun.order').controller('OrderResourceCtrl', ['$scope',
    '$state',
    '$stateParams',
    'OrderService',
    'eayunModal',
    'orderNo',
    function ($scope, $state, $stateParams, OrderService,
              eayunModal, orderNo) {
        var that = this;

        that.resourceTable = {
            source : '/api/ecmc/order/getorderresource',
            api : {},
            getParams : function() {
                return {
                    orderNo : orderNo
                };
            }
        };
    }]);
