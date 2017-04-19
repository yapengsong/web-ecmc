/**
 * Created by liyanchao on 2016/4/18.
 */
'use strict';

angular.module('eayun.net')
    .controller('NetBalanceEditMemberCtrl', ['NetMemberService', '$scope','$http','eayunModal','toast','lbMember',function (NetMemberService, $scope,$http,eayunModal,toast,lbMember ) {
        var vm = this;
        vm.lbMember=lbMember;


        /*编辑pool的提交*/
        $scope.commit = function () {
            $scope.ok(vm.lbMember);

        };


    }]);