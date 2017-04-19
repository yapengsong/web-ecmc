/**
 * Created by eayun on 2016/4/13.
 */
'use strict'

angular.module('eayun.notice')
    .controller('NoticeEditCtrl', ['$scope', 'eayunModal','notice', function ($scope,eayunModal, _notice) {
        //$scope.notice = notice;
        var vm = this;
        vm.notice = angular.copy(_notice,{});
        vm.notice.url = _notice.url == 'null' ? '' : _notice.url;

        $scope.commit = function () {
        	var validTime = vm.notice.validTime;
        	var invalidTime = vm.notice.invalidTime;
        	if(invalidTime>validTime){
        		$scope.ok(vm.notice);
        	}else{
        		eayunModal.error("截止时间必须大于生效时间");
        	}
        }
    }]);