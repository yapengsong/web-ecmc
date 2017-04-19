/**
 * Created by cxy on 2016/4/14.
 */
angular.module('eayun.cabinet')
    .controller('CabinetDetailCtrl', ['datacenterId','cabinetId', function (datacenterId,cabinetId) {
        var vm=this;

        vm.myTable={
            source: '/api/ecmc/physical/cabinet/queryEquById',
            api: {},
            getParams: function () {
                return {
                    cabientId : cabinetId,
                    datacenterId:datacenterId
                };
            }
        }

    }]);