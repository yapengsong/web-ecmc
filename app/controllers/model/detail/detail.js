/**
 * Created by Administrator on 2016/4/1.
 */
angular.module('eayun.switch')
    .controller('ModelDetailCtrl', ['model', function (model) {
        var vm = this;
        vm.model=model;
        vm.startState=vm.model.state;
        vm.endState=parseInt(vm.model.state)+parseInt(vm.model.spec)-1;

    }]);