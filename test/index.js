/* eslint-env mocha */
var sinon = require('sinon');
var Listener = require('../lib/ObjectListener');

var data = {
	'string': 'String',
	'number': 7,
	'null': null,
	'undefined': undefined,
	'object': {some: 'data', and: {nested: 'stuff'}},
	'array': ['some', {array: 'data'}]
};

describe('The Listener class', function() {
	describe('exposes a defer method which', function() {
		it('returns a working method', function() {
			var listener = new Listener();
			var defer = Listener.defer('some.property');

			defer(listener).must.be(listener.child('some.property'));
		});
	});
});

describe('A Listener object', function() {
	var spy = sinon.spy();
	var listener = new Listener();

	afterEach(function() {
		listener.removeAllListeners();
		listener.update();
		spy.reset();
	});

	describe('emits a change event', function() {
		Object.keys(data).map(function(fr) {
			Object.keys(data).map(function(to) {
				if(fr !== to) {
					it('on change ' + fr + ' -> ' + to, function() {
						listener.update(data[fr]);
						listener.on('change', spy);

						listener.update(data[to]);

						spy.calledOnce.must.be.true();
						spy.calledWith(data[to]).must.be.true();
					});
				}
			});
		});
	});

	describe('emits no change event', function() {
		Object.keys(data).map(function(type) {
			it('on stable ' + type, function() {
				listener.update(data[type]);
				listener.on('change', spy);

				listener.update(data[type]);

				spy.called.must.be.false();
			});
		});
	});

	describe('creates child instances which', function() {
		var child = listener.child('prop');

		beforeEach(function() {
			child.removeAllListeners();
		});

		it('are instances of Listener', function() {
			listener.child('prop').must.be.instanceof(Listener);
		});

		it('are cached', function() {
			listener.child('prop').must.be(listener.child('prop'));
		});

		it('can access property chains', function() {
			listener.child('prop').child('prop2').must.be(listener.child('prop.prop2'));
		});

		it('can access reverse chains', function() {
			listener.child('prop.prop3').child('<prop2').must.be(listener.child('prop.prop2'));
		});

		describe('emit a change event', function() {
			Object.keys(data).map(function(fr) {
				Object.keys(data).map(function(to) {
					if(fr !== to) {
						it('on property change ' + fr + ' -> ' + to, function() {
							listener.update({prop: data[fr]});
							child.on('change', spy);

							listener.update({prop: data[to]});

							spy.calledOnce.must.be.true();
							spy.calledWith(data[to]).must.be.true();
						});
					}
				});
			});
		});

		describe('emit no change event', function() {
			Object.keys(data).map(function(type) {
				it('on stable property ' + type, function() {
					listener.update({prop: data[type]});
					child.on('change', spy);
					listener.update({prop: data[type]});

					spy.called.must.be.false();
				});
			});
		});

		it('cannot back-propagate if parent is not an object', function() {
			child.update.bind(child).must.throw();
		});

		describe('can back-propagate data', function() {
			beforeEach(function() {
				listener.update({prop: 0});
			});

			Object.keys(data).map(function(type) {
				it('of type ' + type, function() {
					listener.on('change', spy);
					child.on('change', spy);

					child.update(data[type]);
					spy.calledTwice.must.be.true();
					spy.firstCall.calledWith({prop: data[type]}).must.be.true();
					spy.secondCall.calledWith(data[type]).must.be.true();
				});
			});
		});
	});
});
