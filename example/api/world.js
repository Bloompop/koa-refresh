var app = require('koa')();

app.use(function*() {
	this.body = 'World!';
});

module.exports = app;
