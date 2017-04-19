/**
 * Created by Administrator on 2016/8/17 0017.
 */

'use strict'

angular.module('eayun.customer')
    .controller('CreditLinesCtrl', ['eayunModal', '$scope', '$state', 'CustomerService', '$stateParams', 'toast', 'SysCode', 'cusId', 'creditLines',
        function (eayunModal, $scope, $state, CustomerService, $stateParams, toast, SysCode, cusId, creditLines) {
            var that = this;
            console.info(creditLines);
            that.creditLines = Number(creditLines).toFixed(2);

            $scope.commit = function (){
                $scope.ok(that.creditLines);
            }

            that.checkPattern = function(){

            }
        }])
