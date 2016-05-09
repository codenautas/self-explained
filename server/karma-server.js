"use strict";

var _ = require('lodash');
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var Promises = require('best-promise');
var fs = require('fs-promise');
var path = require('path');
var readYaml = require('read-yaml-promise');
var extensionServeStatic = require('extension-serve-static');

var karma;
var karmaIndex=process.argv.indexOf('--karma');
if(karmaIndex>0){
    var karma = require('karma');
    var karmaConfig = require('../karma.conf.js');
    var options;
    karmaConfig({set:function(opts){ 
        options=opts; 
        if(process.argv.indexOf('--single-run')>0){
            options.singleRun=true;
        }
        var posBrowsers = process.argv.indexOf('--browsers')
        if(posBrowsers>0){
            options.browsers=(process.argv[posBrowsers+1]||'').split(',');
        }
    }});
    options.browsers = options.browsers.filter(function(browser) {
        if(browser.match(/Safari/)) { return false; }
        return true;
    });
    console.log('karma starting');
    var karmaServer = new karma.Server(options, function(exitCode) {
        console.log('Karma has exited with ' + exitCode);
        process.exit(exitCode);
    })
    karmaServer.start();
    console.log('karma starting',options.port);
}

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
