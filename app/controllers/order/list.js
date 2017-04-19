/**
 * Created by Zengbo on 2016/8/12 0012.
 */
'use strict';
angular.module('eayun.order').controller('OrderMngCtrl', ['eayunModal', '$state', 'CustomerService',
    '$stateParams', 'toast', 'SysCode',
    function (eayunModal, $state, CustomerService, $stateParams, toast, SysCode) {
        var that = this;
        that.orderTable = {
            source: '/api/ecmc/order/getorderlist',
            api: {},
            getParams: function () {
                return {
                    startTime: that.startTime ? that.startTime.getTime() : '',
                    endTime: that.endTime ? that.endTime.getTime() : '',
                    orderType: that.orderType ? that.orderType : "",
                    prodName: that.prodName,
                    cusName: that.cusName,
                    orderState: that.orderState ? that.orderState : ""
                };
            }
        };

        that.orderTypes = [{
            id: '0',
            name: '新购'
        }, {
            id: '1',
            name: '续费'
        }, {
            id: '2',
            name: '升级'
        }];

        that.changeType = function () {
            that.orderTable.api.draw();
        };

        that.stateTypes = [{
            id: "1",
            name: '待支付'
        }, {
            id: "2",
            name: '处理中'
        }, {
            id: "3",
            name: '处理失败-已取消'
        }, {
            id: "4",
            name: '已完成'
        }, {
            id: "5",
            name: '已取消'
        }];

        that.changeState = function () {
            that.orderTable.api.draw();
        };

        that.query = function(){
            that.orderTable.api.draw();
        }

        // 查看详情
        that.detail = function(orderId) {
            $state.go('app.order.detail', {
                orderId : orderId
            });
        }
    }]);