/**
 * Created by 陈鹏飞 on 2016/6/12.
 */
'use strict'

angular.module('eayun.mailsms')
    .service('MailService', ['$http', function ($http) {
        var mailService = {};
        mailService.sendMailByUser = function (mailId,_title,userMailList) {
            return $http.post('/api/ecmc/mailbll/sendmailbyuser',{
                mailId:mailId,
                title:_title,
                userMailList:userMailList
            }).then(function (response) {
                return response.data;
            });
        };
        mailService.getMailStatusList = function () {
            return $http.post('/api/ecmc/mailbll/getmailstatuslist').then(function (response) {
                return response.data;
            });
        };
        return {
            sendMailByUser:mailService.sendMailByUser,
            getMailStatusList:mailService.getMailStatusList
        }
    }])
