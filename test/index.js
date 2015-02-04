var util = require('util');
var test = require('tape');

var height = require('../');

var f = util.format;

var m = function(property, result1, result2) {
	return f('measured %s %s > %s', property, result2[property], result1[property]);
};

test('supported flag', function(t) {
	t.ok(height.supported === true);
	t.end();
});

test('zero height for empty string', function(t) {
	var result = height('');

	t.deepEqual(result, {
		ascent: 0,
		descent: 0,
		height: 0,
		size: 16
	});

	t.end();
});

test('zero height for zero size', function(t) {
	var result = height({
		size: 0
	});

	t.deepEqual(result, {
		ascent: 0,
		descent: 0,
		height: 0,
		size: 0
	});

	t.end();
});

test('non-zero height with no options', function(t) {
	var result = height();

	t.ok(result.ascent > 0, f('measured ascent %s', result.ascent));
	t.ok(result.descent > 0, f('measured descent %s', result.descent));
	t.ok(result.height > 0, f('measured height %s', result.height));
	t.equal(result.size, 16);

	t.end();
});

test('increased font size yields greater height', function(t) {
	var result1 = height({ size: 10 });
	var result2 = height({ size: 20 });

	t.ok(result1.ascent > 0);
	t.ok(result2.ascent > result1.ascent, m('ascent', result1, result2));

	t.ok(result1.descent > 0);
	t.ok(result2.descent > result1.descent, m('descent', result1, result2));

	t.ok(result1.height > 0);
	t.ok(result2.height > result1.height, m('height', result1, result2));

	t.equal(result1.size, 10);
	t.equal(result2.size, 20);

	t.end();
});

test('larger letter yields greater ascent', function(t) {
	var result1 = height('a');
	var result2 = height('h');

	t.ok(result2.ascent > result1.ascent, m('ascent', result1, result2));
	t.end();
});

test('hanging letter yields greater descent', function(t) {
	var result1 = height('h');
	var result2 = height('g');

	t.ok(result2.descent > result1.descent, m('descent', result1, result2));
	t.end();
});
