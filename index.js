/**
 * Created by ZHL on 2016/4/1.
 */
'use strict';

var http = require('http'),
    ecstatic = require('ecstatic'),
    compression = require('compression'),
    url = require('url'),
    proxy = require('proxy-middleware'),
    connect = require('connect');

var app = connect();
var proxyOptions = url.parse('http://127.0.0.1:8080/');
proxyOptions.route = '/api';

app.use(compression());

app.use(proxy(proxyOptions));

app.use(ecstatic({
    root: process.cwd() + '/dist'
}));

http.createServer(app).listen(8081);