/**
 * Created by Administrator on 2016/8/18 0018.
 */


angular.module('eayun.customer')
    .controller('CusPrePaidDetailCtrl', ['eayunModal', '$state', '$stateParams', '$http',
        function (eayunModal, $state, $stateParams, $http) {
            var that = this;
            that.cusId = $stateParams.cusId;
            findReportById();
            function findReportById() {
                $http.post("/api/ecmc/order/getorderbyno", {"orderNo": $stateParams.orderNo}).then(function (data) {
                    that.model = data.data.data;
                    that.model.money = that.model.paymentAmount - that.model.accountPayment;
                    that.model.paymentAmount = that.model.paymentAmount;
                    that.model.thirdPartPayment = that.model.thirdPartPayment;
                    that.model.accountPayment = that.model.accountPayment;

                });
            }

            that.orderResource = function (orderNo) {
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '查看资源',
                    width: '800px',
                    templateUrl: 'views/order/resource.html',
                    controller: 'OrderResourceCtrl',
                    controllerAs: 'resource'
                })
            }
        }])