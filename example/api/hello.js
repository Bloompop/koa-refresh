module.exports = function*(next) {
	this.body = 'goodbye!';
	yield next;
};
