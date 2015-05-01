var fs = require('fs');
var path = require('path');
var mount = require('koa-mount');
var compose = require('koa-compose');


var rel = function(p) {
	return path.relative(__dirname, path.join(process.cwd(), p));
};

var dir;
var middleware = [];
var getEndpoints = function(apiDir) {
	var update = false;
	if(!apiDir) {
		apiDir = dir;
		update = true;
	} else {
		dir = apiDir;
	}

	middleware.length = 0;

	middleware = middleware.concat(fs.readdirSync(apiDir)
		.map(function(p) {
			if(path.extname(p) == '.js') {
				return path.basename(p, '.js');
			} else {
				return false;
			}
		}).filter(function(name) {
			return name;
		}).map(function(name) {
			var loc = './' + rel(path.join(apiDir, name));
			if(require.cache[require.resolve(loc)]) {
				delete require.cache[require.resolve(loc)];
			}
			var middleware = require(loc);
			if(middleware.middleware) {
				middleware = mount('/' + name, require(loc));
			}
			return middleware;
		}));

	if(!update) {
		return function*() {
			yield compose(middleware);
		};
	} else {
		process.send('rebuild-api-complete');
	}
};

process.on('message', function(m) {
	if(m == 'rebuild-api') {
		getEndpoints();
	}
});

module.exports = getEndpoints;
