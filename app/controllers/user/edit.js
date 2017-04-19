/**
 * Created by eayun on 2016/4/8.
 */
'use strict'

angular.module('eayun.user')
    .controller('UserSaveCtrl', ['$scope', 'user', 'UserService', 'eayunModal', 'DepartmentService','toast','RoleService',
        function ($scope, _user, UserService, eayunModal, DepartmentService,toast,RoleService) {
            var vm = this;
            vm.user = angular.copy(_user,{});
            if(vm.user.enableFlag=='1'){
                vm.user.enableFlag=true;
            }else{
                vm.user.enableFlag=false;
            }
            vm.user.password='';
            vm.user.confirmPassword = '';
            DepartmentService.getTree().then(function (tree) {
                vm.tree = tree;
            });
            RoleService.querySelectList().then(function (data) {
                vm.roleList=data;
                angular.forEach(vm.user.roles, function (data,index,array) {
                    angular.forEach(vm.roleList, function (data2,index2,arr2) {
                        if(data.id==data2.id){
                            data2.$$isChecked=true;
                        }
                    });
                });
            });
            vm.checkName= function (value) {
                return UserService.validName(value,vm.user.id);
            };
           vm.validConfirmPwd = function(password,confirmPwd){
               console.log("passowrd:" + password);
               console.log("confirmed password:" + confirmPwd);
               if((!password || password == '') && (!confirmPwd || confirmPwd == '')){
                   console.log("both empty!");
                   return true;
               }
               if(password == confirmPwd){
                   return true;
               }
               return false;
           };

            $scope.commit = function () {
                vm.user.roles=[];
                angular.forEach(vm.roleList, function (data,index,arr) {
                    if(data.$$isChecked){
                        vm.user.roles.push(data.id);
                    }
                });
                var promise;
                if (vm.user.id) {
                    promise = UserService.edit(vm.user);
                } else {
                    promise = UserService.add(vm.user);
                }
                promise.then(function (data) {
                    toast.success('保存成功');
                    $scope.ok(data);
                }, function (msg) {
                    eayunModal.error("保存失败", msg);
                });
            };
        }]);
angular.module('eayun.user')
    .directive('validPassword', function() {
        return {
            require: 'ngModel',
            scope: {
                reference: '=validPassword'
            },
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function(viewValue, $scope) {
                    var noMatch = viewValue != scope.reference
                    ctrl.$setValidity('noMatch', !noMatch);
                    return (noMatch)?noMatch:!noMatch;
                });
                scope.$watch("reference", function(value) {;
                    ctrl.$setValidity('noMatch', value === ctrl.$viewValue);
                });
            }
        };
    });
