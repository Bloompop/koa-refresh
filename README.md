# koa-refresh
## An easy way to live reload your middleware with Gulp

### Mounting middleware
Require koa-refresh and pass it the name of your directory containing your middleware files.
```js
var app = require('koa')();
var refresh = require('koa-refresh');

app.use(refresh('api'));

app.listen(5000);
```

The files in your middleware directory can be either generators you would pass into app.use or koa applications.
If you export a koa application in file `lol.js`, it is mounted at `/lol` using `koa-mount`.

### Refreshing with Gulp

#### Require the Gulp plugins:
```js
var rebuild = require('koa-refresh/gulp').rebuild;
var start = require('koa-refresh/gulp').start;
var kill = require('koa-refresh/gulp').kill;
```

#### Start your server:
```js
gulp.src('app.js')
	.pipe(start({
		flags: ['--harmony']
	}))
	.pipe(notify({
		message: 'Server Started!'
	}));
```
Start takes an options object with two properties: `flags` and `args`.
`flags` is an array of your Node flags.
`args` is an array of arguments to pass to your server.

#### Create a task to refresh after change:
```js
return gulp.src('app.js')
	.pipe(rebuild())
	.pipe(notify({
		message: 'API endpoints rebuilt!'
	}));
```

#### Make sure your server exits when Gulp does:
```js
process.on('exit', kill);
```

### Example
Try out the example in `/example`. If you have Gulp globally installed, you can run `gulp watch`. Anytime you update a file in `/example/api`, Gulp will trigger a refresh.
