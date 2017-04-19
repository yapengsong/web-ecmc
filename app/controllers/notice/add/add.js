/**
 * Created by eayun on 2016/4/7.
 */
'use strict'

angular.module('eayun.notice')
    .controller('NoticeAddCtrl', ['$scope','eayunModal', function ($scope,eayunModal) {
        $scope.notice = {};

        $scope.commit = function () {
        	var validTime = $scope.notice.validTime;
        	var invalidTime = $scope.notice.invalidTime;
        	if(invalidTime>validTime){
        		$scope.ok($scope.notice);
        	}else{
        		eayunModal.error("截止时间必须大于生效时间");
        	}
        }
    }]);