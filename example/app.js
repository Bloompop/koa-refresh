var app = require('koa')();
var refresh = require('../');

app.use(refresh('api'));

app.listen(5000);
