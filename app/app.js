'use strict';

// 这里只创建模块，不要写逻辑，所依赖的模块可以根据需要裁减
angular.module('eayun.ecmc', [
    'ngAnimate',    // 动画效果
    'ngCookies',    // 在程序中访问Cookie
    'ngSanitize',   // 对html内容进行净化，以防范xss等前端攻击
    'ui.router',    // 第三方的路由访问器
    'ui.bootstrap.modal',
    'ui.bootstrap.datepicker',
    'ui.bootstrap.dateparser',
    'ui.bootstrap.position',
    'ui.bootstrap.bindHtml',
    'ui.bootstrap.tooltip',
    'ngFileUpload',

    'eayun.ui.components',
    'eayun.overview',
    'eayun.cloudhost',
    'eayun.image',
    'eayun.obs',
    'eayun.customer',
    'eayun.workorder',
    'eayun.message',
    'eayun.notice',
    'eayun.center',
    'eayun.server',
    'eayun.cabinet',
    'eayun.switch',
    'eayun.storage',
    'eayun.firewall',
    'eayun.model',
    'eayun.ip',
    'eayun.monitor',
    'eayun.warning',
    'eayun.contacts',
    'eayun.department',
    'eayun.menu',
    'eayun.role',
    'eayun.authority',
    'eayun.user',
    'eayun.log',
    'eayun.net',
    'eayun.safe',
    'eayun.sysdatatree',
    'eayun.task',
    'eayun.mailsms',
    'eayun.sysdatatree',
    'eayun.price',
    'eayun.cusonline',
    'eayun.order',
    'eayun.quotatemp',
    'eayun.recycle',
    'eayun.api',
    'eayun.unit'
]);
