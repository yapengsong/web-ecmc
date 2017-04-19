/**
 * Created by Administrator on 2016/8/16 0016.
 */

'use strict';
angular.module('eayun.order').controller('OrderDetailCtrl', ['eayunModal', '$state', 'OrderService',
    '$stateParams', 'toast', 'SysCode',
    function (eayunModal, $state, OrderService, $stateParams, toast, SysCode) {
        var that = this;
        OrderService.getOrderById($stateParams.orderId).then(
            function (response) {
                that.order = response.data;
            });
        that.orderResource = function(orderNo) {
            var result = eayunModal.dialog({
                showBtn : false,
                title: '查看资源',
                width: '800px',
                templateUrl : 'controllers/order/detail/resource.html',
                resolve : {
                    orderNo : function(){
                        return orderNo;
                    }
                },
                backdrop : "static",
                controller : 'OrderResourceCtrl',
                controllerAs : 'resource'
            }).result;
        }
    }]);