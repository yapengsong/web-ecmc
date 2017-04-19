



/**
 * Created by chenglong on 2016/6/21 0021.
 */

angular.module('eayun.unit')
    .controller('guanjureturnCtrl', ['model','ServiceunitService','$scope','eayunModal', function (model,ServiceunitService,$scope,eayunModal) {
        var vm = this;

        vm.model=model;

        vm.chekrecord=function(){
          if(vm.status=='8'){
              vm.returnType=undefined;
          }
        }



        vm.showFag=0;


        vm.showorNo=function(s){

            if(s==0){
                vm.showFag=1
            }else{
                vm.showFag=0
            }


        }


        vm.returnrecord=function(state,recordtype){
            var str=''
                if(state=='8'){
                    vm.model.status=8;
                    str='请确认管局通过操作?';
                }else{
                    str='请确认管局未通过操作?';
                    vm.model.status=7;
                    vm.model.returnType=recordtype;
                }
            eayunModal.confirm(str).then(
                function (){

                    $scope.ok(vm.model);

                }

            );

        }



        vm.businessFileId=false;
        vm.dutyFileId=false;
        vm.dutywebFileId=true;
        vm.domainFileId=true;
        vm.specialFileId=true;
        if( vm.model.businessFileId==''|| vm.model.businessFileId==null|| vm.model.businessFileId==undefined){
            vm.businessFileId=true;
        }
        if( vm.model.dutyFileId==''|| vm.model.dutyFileId==null|| vm.model.dutyFileId==undefined){
            vm.dutyFileId=true;
        }
        if(vm.model.webs.length>0){
            for(var i=0;i<vm.model.webs.length;i++){
                vm.webs=vm.model.webs;

                if( vm.webs[i].dutyFileId!=''&& vm.webs[i].dutyFileId!=null&& vm.webs[i].dutyFileId!=undefined){
                    vm.dutywebFileId=false;
                }
                if( vm.webs[i].domainFileId!=''&&  vm.webs[i].domainFileId!=null&& vm.webs[i].domainFileId!=undefined){
                    vm.domainFileId=false;

                }
                if( vm.webs[i].specialFileId!=''&&  vm.webs[i].specialFileId!=null&&vm.webs[i].specialFileId!=undefined){

                    vm.specialFileId=false;
                }
            }
        }

        vm.unitimg=function() {

            var result = eayunModal.dialog({
                showBtn: false,
                title: '主体负责人',
                width: '800px',
                templateUrl: 'controllers/unit/unitImg/unitfzr.html',
                controller: 'unitfzrCtrl',
                controllerAs: 'unitfzr',
                resolve: {
                    models: vm.model
                }

            });
        };
        vm.yinyeimg=function() {

            var result = eayunModal.dialog({
                showBtn: false,
                title: '营业执照',
                width: '800px',
                templateUrl: 'controllers/unit/unitImg/yinye.html',
                controller: 'yinyeCtrl',
                controllerAs: 'yinye',
                resolve: {
                    models: vm.model
                }

            });
        };
        vm.weburlimg=function() {

            var result = eayunModal.dialog({
                showBtn: false,
                title: '网站域名证书',
                width: '800px',
                templateUrl: 'controllers/unit/unitImg/weburl.html',
                controller: 'weburlCtrl',
                controllerAs: 'weburl',
                resolve: {
                    models: vm.model
                }

            });
        };
        vm.webfzrimg=function() {

            var result = eayunModal.dialog({
                showBtn: false,
                title: '网站负责人',
                width: '800px',
                templateUrl: 'controllers/unit/unitImg/webfzr.html',
                controller: 'webfzrCtrl',
                controllerAs: 'webfzr',
                resolve: {
                    models: vm.model
                }

            });
        }
        vm.qianzhiimg=function() {

            var result = eayunModal.dialog({
                showBtn: false,
                title: '前置专项审批',
                width: '800px',
                templateUrl: 'controllers/unit/unitImg/qianzhi.html',
                controller: 'qianzhiCtrl',
                controllerAs: 'qianzhi',
                resolve: {
                    models: vm.model
                }

            });
        }


        vm.recursiveReplace = function(str){
            if (str!=null && str != undefined && str!='') {
                if(str.indexOf(",,") < 0){
                    if(str.length>1){
                        var strx = str.substring(0,1);
                        if(strx==","){
                            str = str.substring(1,str.length);
                        }
                    }
                    return str;
                }else{
                    str = str.replace(",,",",");
                    return vm.recursiveReplace(str);
                }
            }else{
                return '';
            }
        }
        for(var i=0;i<model.webs.length;i++){
            vm.model.webs[i].serviceContent=vm.recursiveReplace(vm.model.webs[i].serviceContent);

            vm.model.webs[i].webLanguage=vm.recursiveReplace(vm.model.webs[i].webLanguage);
        }



    }]);