/**
 * Created by Administrator on 2016/8/16 0016.
 */
'use strict'

angular.module('eayun.order').service('OrderService',
    [ '$http', 'eayunModal', function($http, eayunModal) {
        var orderService = {};
        orderService.getOrderById = function(orderId) {
            return $http.post('/api/ecmc/order/getorder', {orderId: orderId} ).then(function(response){
                return response.data;
            });
        };

        return {
            getOrderById : orderService.getOrderById
        }
    } ]);