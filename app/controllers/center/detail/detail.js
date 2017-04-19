/**
 * Created by cxy on 2016/4/6.
 */
angular.module('eayun.center')
    .controller('CenterDetailCtrl', ['model', function (model) {
        var vm=this;
        vm.model=model;
        vm.model.creDate=new Date(vm.model.creDate);
    }]);