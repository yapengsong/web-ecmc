

/**
 * Created by eayun on 2016/4/19.
 */
'use strict'

angular.module('eayun.safe')
    .controller('editcusListCtrl', ['$scope', '$state', 'MessageService','addcusList','selectistolist','vmlist' , function ($scope, $state, MessageService,addcusList,selectistolist,vmlist) {
        var vm = this;
        vm.Addlist=addcusList;
        addcusList=undefined;
        vm.selectlist=selectistolist;
        vm.checkFag=true;

    console.info(addcusList);
        console.info(selectistolist);
        console.info(vmlist);
        vm.discheck=false;
        if(addcusList==undefined)  {


        MessageService.getReceiveList().then(function (data) {
            vm.sendPersonList = data.sendPerson;
            data.customer.unshift({'cusId': 'ALL', 'cusCpname': '全部公司'});
            vm.ruleListToSelect = data.customer;
            //console.info(vm.ruleListToSelect)
            //vmlist.cusListsId = vmlist.cusListsId.substring(0,vmlist.cusListsId.length-1);
            //
            //vmlist.cuss = vmlist.cusListsId.split(",");

            for (var i = 0; i <  vm.ruleListToSelect.length; i++) {
                for (var j = 0; j < vmlist.cusListobj.length; j++) {

                    if (vmlist.cusListobj[j].cusId ==   vm.ruleListToSelect[i].cusId) {

                       if(vmlist.cusListobj[j].cusId=="ALL"){
                           vm.discheck=true;

                       }


                        if( vm.ruleListIsSelected!=vm.ruleListToSelect[i]){
                            vm.ruleListIsSelected.push( vm.ruleListToSelect[i]);
                            vm.checkFag = false;
                            vm.ruleListToSelect.splice(i, 1);
                        }




                    }
                }
            }



        });
        }



        vm.ruleListToSelect= vm.Addlist;
        vm.ruleListIsSelected=[];



        if(undefined!=vm.selectlist) {

            for (var k = 0; k < vm.selectlist.length; k++) {
                if (vm.selectlist[k].cusId == vm.ruleListToSelect[k].cusId) {

                    if (vm.selectlist[k].cusId.cusId == "ALL") {
                        vm.discheck = true;

                    }
                    for(var x=0;x<vm.ruleListIsSelected.length;x++){
                        console.info(vm.ruleListIsSelected[x].cusId);
                        if(vm.ruleListIsSelected[x].cusId==vm.selectlist[k].cusId.cusId){
                            vm.ruleListIsSelected.push(vm.selectlist[k]);
                        }
                    }



                    vm.checkFag = false;

                }
            }


        }


        vm.addRuleToList = function (_rule) {
            vm.ruleListIsSelected.push(_rule);
            if(vm.ruleListIsSelected.length>0){
                vm.checkFag=false;
            }

            if(_rule.cusId=='ALL'){
                vm.discheck=true;
                vm.ruleListIsSelected=[_rule];

               // vm.ruleListIsSelected.push(_rule);

            }
            for (var i = 0; i < vm.ruleListToSelect.length; i++) {

                if (vm.ruleListToSelect[i].cusId == _rule.cusId) {
                    vm.ruleListToSelect.splice(i, 1);
                    break;
                }
            }
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

            addcusList=[];
            selectistolist=[];
            vm.Addlist=addcusList;
            vm.selectlist=selectistolist;
            vm.ruleListIsSelected=[];
        }
    }]);