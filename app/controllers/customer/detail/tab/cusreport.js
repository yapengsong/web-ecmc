/**
 * Created by Administrator on 2016/8/18 0018.
 */
'use strict'

angular.module('eayun.customer')
    .controller('CusReportCtrl', ['eayunModal', '$state', 'CustomerService', '$stateParams', 'toast', 'SysCode',
        function (eayunModal, $state, CustomerService, $stateParams, toast, SysCode) {
            var that = this;
            that.isPostPaid = ($state.current.url == "/postpaid" || $state.current.url == "/cusreport");


            that.postPaidReport = function () {
                that.isPostPaid = true;
                $state.go("app.customer.detail.cusreport.postpaid");
            }

            that.prePaidReport = function () {
                that.isPostPaid = false;
                $state.go("app.customer.detail.cusreport.prepaid");
            }
        }]);
