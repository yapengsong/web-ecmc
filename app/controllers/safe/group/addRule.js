/**
 * Created by ZH.F on 2016/4/17.
 */
'use strict';

angular.module('eayun.safe')
    .controller('SafeGroupRuleCtrl', ['$scope', 'SafeGroupService', 'safeGroup', 'eayunModal', 'toast',
        function ($scope, SafeGroupService, safeGroup, eayunModal, toast) {
            var vm = this;

            vm.sgRule = {};
            vm.safeGroup = safeGroup;

            vm.sgRule.iptrueofflase=1;
            vm.sgRule.direction='ingress';
            vm.sgRule.datacenterId = vm.safeGroup.dcId;
            vm.sgRule.projectId = vm.safeGroup.prjId;
            vm.sgRule.securityGroupId = vm.safeGroup.sgId;
            vm.sgRule.from='CIDR';

            if( vm.sgRule.ICMPType=='99'&& vm.sgRule.ICMPCode=='00'){
                vm.sgRule.icmp='所有';

            }


            var item = function (_value, _readonly, _min, _max) {
                this.value = _value;
                this.readonly = _readonly;
                this.min = _min;
                this.max = _max;
                this.valid = true;
            };

            //------------------port validation BEGIN----------------------//
            vm.small = false;
            vm.big = false;
            vm.smallPort = function(type){
                if(type=='type'){
                    vm.sgRule.protocolExpand="";
                }
                vm.minMsg="";
                var nameTest=/^(^[1-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)$/;
                var min = $("#port_range_min").val();
                var max = $("#port_range_max").val();
                if(min == null){
                    vm.small = true;
                    vm.minMsg="请输入1-65535的整数";

                }else{//小的有值
                    if(!min.match(nameTest)){//小的有值 且符合正则
                        vm.small = true;
                        vm.minMsg="请输入1-65535的整数";
                    }else{
                        vm.small = false;
                        if(max!=null&& max.match(nameTest)){
                            if(parseInt(min)>parseInt(max)){
                                vm.small = true;
                                vm.minMsg="请输入小于等于终止端口的整数";
                                vm.big = false;
                            }else if(parseInt(min)<=parseInt(max)){
                                vm.small = false;
                                vm.big = false;
                                vm.minMsg="";
                            }
                        }
                    }
                }
            };

            vm.bigPort = function(type){
                if(type=='type'){
                    vm.sgRule.protocolExpand="";
                }
                vm.maxMsg="";
                var nameTest=/^(^[1-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)$/;

                var min = $("#port_range_min").val();
                var max = $("#port_range_max").val();
                if(max == null){
                    vm.big = true;
                    vm.maxMsg="请输入1-65535的整数";

                }else{//大的有值
                    if(!max.match(nameTest)){//大的有值 且符合正则
                        vm.big = true;
                        vm.maxMsg="请输入1-65535的整数";
                    }else{
                        vm.big = false;
                        if(min!=null&& min.match(nameTest)){
                            if(parseInt(min)>parseInt(max)){
                                vm.big = true;
                                vm.maxMsg="请输入大于等于起始端口的整数";
                                vm.small = false;
                            }else if(parseInt(min)<=parseInt(max)){
                                vm.big = false;
                                vm.small = false;
                                vm.maxMsg="";
                            }
                        }
                    }
                }
            };

            //var a = [new item(1, false, 0, 255), new item(0, false, 0, 255), new item(0, false, 0, 255), new item(0, false, 0, 255), new item(16, false, 19, 24)];
            //
            //
            //vm.cidrs = [a];
            //vm.focus = function (item) {
            //    vm.curItem = item;
            //};
            //vm.blur = function () {
            //    vm.curItem = undefined;
            //};
            //vm.check = function (value, newValue) {
            //    newValue = parseInt(newValue) || 0;
            //    var check = newValue >= vm.curItem.min && newValue <= vm.curItem.max;
            //    vm.curItem.valid = check;
            //    vm.changeErr();
            //    return newValue+'';
            //};
            //
            //vm.changeErr = function (value){
            //    vm.cidrErr = false;
            //    var cidr = vm.cidrs[vm.radio];
            //    for (var i = 0; i < cidr.length; i++) {
            //
            //        if (!cidr[i].valid) {
            //            vm.cidrErr = true;
            //
            //            break;
            //        }
            //    }
            //
            //};
            //vm.changeSubnetCidr = function(){
            //    var a = [new item(1, false, 0, 255), new item(0, false, 0, 255), new item(0, false, 0, 255), new item(0, false, 0, 255), new item(16, false, 16, 24)];
            //
            //
            //    vm.cidrs = [a];
            //
            //    vm.changeErr();
            //
            //
            //
            //};

            vm.sgRule.source_ip_address1 = 0;
            vm.sgRule.source_ip_address2 = 0;
            vm.sgRule.source_ip_address3 = 0;
            vm.sgRule.source_ip_address4 = 0;
            vm.sgRule.source_ip_address5 = 0;

            var regx=/^(0|[1-9]\d*)$/;
            vm.sourrange = "0.0.0.0/0代表所有IP地址";

            vm.cidraError = true;

            function checkCidr0_255(val,fromFunc) {
                if(fromFunc=="focus"){

                        vm.sourrange="可填写0-255之间的整数！";

                }else{
                    vm.sourrange = "0.0.0.0/0代表所有IP地址";

                }
                if (val >= 0 && val <= 255 && regx.test(val)) {

                    return false;
                } else {

                    return true;
                }
            };
            function checkCidr0_32(val,fromFunc) {
                if(fromFunc=="focus"){

                        vm.sourrange="可填写0-32之间的整数！";

                }else{
                    vm.sourrange = "0.0.0.0/0代表所有IP地址";

                }
                if (val >= 0 && val <= 32 && regx.test(val)) {
                    return false;
                } else {
                    return true;
                }
            };
            vm.checkTypeCidr = function(position,fromFunc) {

                if (position == '' || position == null) {
                    vm.a1Error = false;
                    vm.a2Error = false;
                    vm.a3Error = false;
                    vm.a4Error = false;
                    vm.a5Error = false;

                    vm.cidraError = false;

                    return;
                }
                ;
                if (position == 'a1') {
                    vm.a1Error = checkCidr0_255(vm.sgRule.source_ip_address1, fromFunc);
                } else if (position == 'a2') {
                    vm.a2Error = checkCidr0_255(vm.sgRule.source_ip_address2, fromFunc);
                } else if (position == 'a3') {
                    vm.a3Error = checkCidr0_255(vm.sgRule.source_ip_address3, fromFunc);
                } else if (position == 'a4') {
                    vm.a4Error = checkCidr0_255(vm.sgRule.source_ip_address4, fromFunc);
                } else if (position == 'a5') {
                    vm.a5Error = checkCidr0_32(vm.sgRule.source_ip_address5, fromFunc);

                }

                if (!vm.a1Error && !vm.a2Error && !vm.a3Error && !vm.a4Error && !vm.a5Error) {

                    vm.sgRule.remote_ip_prefix = parseInt(vm.sgRule.source_ip_address1) + "." + parseInt(vm.sgRule.source_ip_address2) + "." + parseInt(vm.sgRule.source_ip_address3) + "." + parseInt(vm.sgRule.source_ip_address4) + "/" + parseInt(vm.sgRule.source_ip_address5);
                    vm.cidraError = true;
                } else {
                    vm.cidraError = false;
                }

            };





            //------------------port validation END----------------------//

            vm.querySecurityGroups = function (){
                vm.sgRule.from='SecurityGroup';
                if(vm.sgRule.from=="SecurityGroup"){

                    SafeGroupService.getSecurityGroupsByIds(vm.sgRule.datacenterId,vm.sgRule.projectId).then(function(response){
                        vm.securityGroupItems = response.data;
                    });
                }
            };

            $scope.commit = function () {




                vm.sgRule.icmp='--';

                if( vm.sgRule.icmptype=='99'&&vm.sgRule.icmpcode=='99' && !vm.fag){

                    vm.sgRule.icmp='所有';
                }
                if(vm.sgRule.icmptype!=''&& vm.sgRule.icmptype!='99'&&undefined!=vm.sgRule.icmptype){
                    vm.sgRule.icmp=vm.sgRule.icmptype+"/"+vm.sgRule.icmpcode;
                    vm.sgRule.protocolExpand="";
                }


                if(vm.sgRule.icmptype==0){
                    vm.sgRule.icmp=vm.sgRule.icmptype+"/"+vm.sgRule.icmpcode;
                }
                var promise;
                promise = SafeGroupService.createSecurityGroupRule(vm.sgRule);
                promise.then(function (data) {
                    $scope.ok(data);
                }, function (data) {
                    eayunModal.error("保存失败",500);
                });
            };


            vm.butt=function (){
                vm.buttclasstcp=false;
                vm.buttclassudp=false;
                vm.buttclassicmp=false;
                vm.buttclassdns=false;
                vm.buttclasshttp=false;
                vm.buttclasshttps=false;
                vm.buttclassimap=false;
                vm.buttclassimaps=false;
                vm.buttclassladp=false;
                vm.buttclassmssql=false;
                vm.buttclassmysql=false;
                vm.buttclasspop3=false;
                vm.buttclasspop3s=false;
                vm.buttclassrdp=false;
                vm.buttclasssmtp=false;
                vm.buttclasssmtps=false;
                vm.buttclassssh=false;

                vm.buttclassfalse=false;
                vm.buttclasstrue=false;

            }






            vm.fag=true;

            vm.alltcp=function(){
                vm.butt();
                vm.buttclasstcp=true;

                vm.sgRule.protocol='TCP';
                vm.sgRule.port_range_min='1';
                vm.sgRule.port_range_max='65535';
                vm.smallPort();
                vm.bigPort();
                vm.small = false;
                vm.big = false;
                vm.fag=true;

            }
            vm.alludp=function(){
                vm.butt();
                vm.buttclassudp=true;

                vm.sgRule.protocol='UDP';
                vm.sgRule.port_range_min='1';
                vm.sgRule.port_range_max='65535';
                vm.smallPort();
                vm.bigPort();
                vm.small = false;
                vm.big = false;
                vm.fag=true;
            }
            vm.allicmp=function(){
                vm.butt();
                vm.buttclassicmp=true;

                vm.sgRule.protocol='ICMP';
                vm.sgRule.icmpcode='99';
                vm.sgRule.icmptype='99';
                vm.fag=false;

                vm.sgRule.port_range_min = '';
                vm.sgRule.port_range_max = '';
                vm.sgRule.protocolExpand='';
            }
            vm.dns=function(){

                vm.butt();
                vm.buttclassdns=true;
                vm.sgRule.protocol='TCP';
                vm.sgRule.port_range_min='53';
                vm.sgRule.port_range_max='53';
                vm.smallPort();
                vm.bigPort();
                vm.small = false;
                vm.big = false;
                vm.fag=true;

                vm.sgRule. protocolExpand='53(DNS)';
            }
            vm.http=function(){
                vm.butt();
                vm.buttclasshttp=true;
                vm.sgRule.protocol='TCP';
                vm.sgRule.port_range_min='80';
                vm.sgRule.port_range_max='80';
                vm.sgRule. protocolExpand='80(HTTP)';
                vm.smallPort();
                vm.bigPort();
                vm.small = false;
                vm.big = false;
                vm.fag=true;

            }
            vm.https=function(){
                vm.butt();
                vm.buttclasshttps=true;
                vm.sgRule.protocol='TCP';
                vm.sgRule.port_range_min='443';
                vm.sgRule.port_range_max='443';
                vm.sgRule. protocolExpand='443(HTTPS)';
                vm.smallPort();
                vm.bigPort();
                vm.small = false;
                vm.big = false;
                vm.fag=true;

            }
            vm.imap=function(){
                vm.butt();
                vm.buttclassimap=true;
                vm.sgRule.protocol='TCP';
                vm.sgRule.port_range_min='143';
                vm.sgRule.port_range_max='143';
                vm.sgRule. protocolExpand='143(IMAP)';
                vm.smallPort();
                vm.bigPort();
                vm.small = false;
                vm.big = false;
                vm.fag=true;

            }
            vm.imaps=function(){
                vm.butt();
                vm.buttclassimaps=true;
                vm.sgRule.protocol='TCP';
                vm.sgRule.port_range_min='993';
                vm.sgRule.port_range_max='993';
                vm.sgRule. protocolExpand='993(IMAPS)';
                vm.smallPort();
                vm.bigPort();
                vm.small = false;
                vm.big = false;
                vm.fag=true;

            }
            vm.ladp=function(){
                vm.butt();
                vm.buttclassladp=true;
                vm.sgRule.protocol='TCP';
                vm.sgRule.port_range_min='389';
                vm.sgRule.port_range_max='389';
                vm.sgRule. protocolExpand='389(LDAP)';
                vm.smallPort();
                vm.bigPort();
                vm.small = false;
                vm.big = false;
                vm.fag=true;

            }
            vm.mssql=function(){
                vm.butt();
                vm.buttclassmssql=true;
                vm.sgRule.protocol='TCP';
                vm.sgRule.port_range_min='1443';
                vm.sgRule.port_range_max='1443';
                vm.sgRule. protocolExpand='1443(MS SQL)';
                vm.smallPort();
                vm.bigPort();
                vm.small = false;
                vm.big = false;
                vm.fag=true;

            }
            vm.mysql=function(){
                vm.butt();
                vm.buttclassmysql=true;
                vm.sgRule.protocol='TCP';
                vm.sgRule.port_range_min='3306';
                vm.sgRule.port_range_max='3306';
                vm.sgRule. protocolExpand='3306(MYSQL)';
                vm.smallPort();
                vm.bigPort();
                vm.small = false;
                vm.big = false;
                vm.fag=true;

            }
            vm.pop3=function(){
                vm.butt();
                vm.buttclasspop3=true;
                vm.sgRule.protocol='TCP';
                vm.sgRule.port_range_min='110';
                vm.sgRule.port_range_max='110';
                vm.sgRule. protocolExpand='110(POP3)';
                vm.smallPort();
                vm.bigPort();
                vm.small = false;
                vm.big = false;
                vm.fag=true;

            }
            vm.pop3s=function(){
                vm.butt();
                vm.buttclasspop3s=true;
                vm.sgRule.protocol='TCP';
                vm.sgRule.port_range_min='995';
                vm.sgRule.port_range_max='995';
                vm.sgRule. protocolExpand='995(POP3S)';
                vm.smallPort();
                vm.bigPort();
                vm.small = false;
                vm.big = false;
                vm.fag=true;

            }
            vm.rdp=function(){
                vm.butt();
                vm.buttclassrdp=true;
                vm.sgRule.protocol='TCP';
                vm.sgRule.port_range_min='3389';
                vm.sgRule.port_range_max='3389';
                vm.sgRule. protocolExpand='3389(RDP)';
                vm.smallPort();
                vm.bigPort();
                vm.small = false;
                vm.big = false;
                vm.fag=true;

            }

            vm.smtp=function(){
                vm.butt();
                vm.buttclasssmtp=true;
                vm.sgRule.protocol='TCP';
                vm.sgRule.port_range_min='25';
                vm.sgRule.port_range_max='25';
                vm.sgRule. protocolExpand='25(SMTP)';
                vm.smallPort();
                vm.bigPort();
                vm.small = false;
                vm.big = false;
                vm.fag=true;

            }
            vm.smtps=function(){
                vm.butt();
                vm.buttclasssmtps=true;
                vm.sgRule.protocol='TCP';
                vm.sgRule.port_range_min='465';
                vm.sgRule.port_range_max='465';
                vm.sgRule. protocolExpand='465(SMTPS)';
                vm.smallPort();
                vm.bigPort();
                vm.small = false;
                vm.big = false;
                vm.fag=true;

            }
            vm.ssh=function(){
                vm.butt();
                vm.buttclassssh=true;
                vm.sgRule.protocol='TCP';
                vm.sgRule.port_range_min='22';
                vm.sgRule.port_range_max='22';
                vm.sgRule. protocolExpand='22(SSH)';
                vm.smallPort();
                vm.bigPort();
                vm.small = false;
                vm.big = false;
                vm.fag=true;

            }
            vm.chektcporicmp=function(){

                vm.sgRule.icmpcode=undefined;
                vm.sgRule.icmptype=undefined;
                vm.sgRule.port_range_min = '';
                vm.sgRule.port_range_max = '';
                vm.sgRule.protocolExpand='';
                vm.fag=false;
            };
            vm.alltcp();
        }]);