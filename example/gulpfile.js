var gulp = require('gulp');
var rebuild = require('./../gulp').rebuild;
var start = require('./../gulp').start;
var kill = require('./../gulp').kill;
var notify = require('gulp-notify');

gulp.task('start', [], function() {
	gulp.src('app.js')
		.pipe(start({
			flags: ['--harmony']
		}))
		.pipe(notify({
			message: 'Server Started!'
		}));
});

process.on('exit', kill);

gulp.task('default', []);

gulp.task('watch', ['start'], function() {
	gulp.task('rebuild', [], function() {
		return gulp.src('app.js')
			.pipe(rebuild())
			.pipe(notify({
				message: 'API endpoints rebuilt!'
			}));
	});

	gulp.watch('api/**/*', {
		debounceDelay: 2000
	}, ['rebuild']);
});
