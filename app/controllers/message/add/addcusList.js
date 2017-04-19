

/**
 * Created by eayun on 2016/4/19.
 */
'use strict'

angular.module('eayun.safe')
    .controller('addcusListCtrl', ['$scope', '$state', 'SafeGroupService','addcusList','selectistolist' , function ($scope, $state, SafeGroupService,addcusList,selectistolist) {
        var vm = this;
        vm.model=addcusList;
        vm.select=selectistolist;
        vm.discheck=false;


        vm.checkFag=true;
        vm.ruleListToSelect=addcusList;
        vm.ruleListIsSelected=[];

        if(undefined!=vm.select){
        for(var k=0;k<vm.select.length;k++){
            vm.ruleListIsSelected.push(selectistolist[k])
            for (var i = 0; i < vm.ruleListToSelect.length; i++) {
                if (vm.ruleListToSelect[i].cusId == selectistolist[k].cusId) {
                    vm.ruleListToSelect.splice(i, 1);
                    break;
                }

            }
            if(selectistolist[k].cusId=='ALL'){

                vm.discheck=true;
            }
        }
            vm.checkFag=false;
        }

        vm.addRuleToList = function (_rule) {
            vm.ruleListIsSelected.push(_rule);
            if(vm.ruleListIsSelected.length>0){
                vm.checkFag=false;
            }


            for (var i = 0; i < vm.ruleListToSelect.length; i++) {

                if (vm.ruleListToSelect[i].cusId == _rule.cusId) {
                
                    vm.ruleListToSelect.splice(i, 1);

                    break;
                }
            }
            if(_rule.cusId=='ALL'){
                vm.discheck=true;

                for(var i = 0; i < vm.ruleListIsSelected.length; i++){


                    if(vm.ruleListIsSelected[i].cusId!='ALL'){

                        vm.ruleListToSelect.push(vm.ruleListIsSelected[i]);
                    }
                }
                vm.ruleListIsSelected=[_rule];
                // vm.ruleListIsSelected.push(_rule);

            }
           //
        };

        vm.removeRuleFromList = function (_rule) {
            vm.ruleListToSelect.push(_rule);

            if(_rule.cusId=='ALL'){
                vm.discheck=false;
            }
            for (var i = 0; i < vm.ruleListIsSelected.length; i++) {
                if (vm.ruleListIsSelected[i].cusId == _rule.cusId) {
                    vm.ruleListIsSelected.splice(i, 1);
                    break;
                }

            }

            if(vm.ruleListIsSelected.length==0){
                vm.checkFag=true;
            }
        };



        $scope.commit = function () {

            $scope.ok(vm.ruleListIsSelected);
        }
    }]);