/**
 * Created by cl on 2016/6/21 0021.
 */
angular.module('eayun.center')
    .controller('TaskDetailCtrl', ['model', function (model) {
        var vm=this;
        vm.model=model;
        // vm.model.creDate=new Date(vm.model.creDate);
        vm.divlistvalue=[];
        if(!vm.model.dataMap){
            vm.divlistvalue.push({});
        }
        for(var key in vm.model.dataMap){

            vm.divlistvalue.push({"key":key,"value":vm.model.dataMap[key]})
        }

    }]);