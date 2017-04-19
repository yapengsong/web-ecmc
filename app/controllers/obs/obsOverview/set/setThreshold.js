/**
 * Created by Administrator on 2016/3/31.
 */
'use strict';

angular.module('eayun.obs')
    .controller('ObsOVSetController', ['ObsService', function (ObsService) {
        var vm = this;
        vm.threshold={};
        ObsService.getThreshold().then(function (data) {
            vm.threshold=data;
        });



    }]);