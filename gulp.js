var through = require('through2');
var spawn = require('child_process').spawn;

var child;

var kill = function() {
	if(child) {
		child.kill();
	}
};

module.exports = {
	start: function(opts) {
		opts = opts || {};
		var flags = opts.flags || [];
		var args = opts.args || [];
		return through.obj(function(file, enc, cb) {
			kill();
			var nodeArgs = flags.concat([file.path]).concat(args);
			child = spawn('node', nodeArgs, {
				stdio: [0, 1, 2, 'ipc']
			}, function(error, stdout, stderr) {

			});
			cb();
		});
	},
	rebuild: function() {
		return through.obj(function(file, enc, cb) {
			console.log('rebuild');
			var listener = function(m) {
				console.log('message-child', m);
				if(m == 'rebuild-api-complete') {
					child.removeListener('message', listener);
					cb(null, file);
				}
			};
			child.on('message', listener);
			child.send('rebuild-api');
		});
	},
	kill: kill
};
