/**
 * Created by Administrator on 2016/3/31.
 */
'use strict';

angular.module('eayun.obs')
    .controller('setObsQuotaCtrl',['ObsService','cusId' ,function (ObsService,cusId) {
        var vm=this;
        vm.obs={
            storage:''
        };
        ObsService.getQuota(cusId).then(function (data) {
            vm.obs.storage=data.storageUsed;
          });


    }]);