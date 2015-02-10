var util = require('util');
var unit = require('parse-unit');
var extend = require('xtend');
var textWidth = require('text-width');

var CLEAR_PADDING = 5;

var supported = function() {
	if(!textWidth.supported) return false;

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');

	return (typeof context.getImageData === 'function');
};

var empty = function(size) {
	return {
		ascent: 0,
		descent: 0,
		height: 0,
		size: size || 0
	};
};

var px = function(size) {
	if(typeof size === 'number') return size;

	size = unit(size);

	var v = size[0] || 0;
	var u = size[1] || 'px';

	switch(u) {
		case 'px': return v;
		case 'cm': return v * 37.8;
		case 'mm': return v * 3.78;
		case 'in': return v * 96;
		case 'pt': return v * (4 / 3);
		case 'pc': return v * 16;
		default: return 0;
	}
};

var font = function(options) {
	options = extend({
		style: 'normal',
		variant: 'normal',
		weight: 'normal',
		size: 'medium',
		family: 'sans-serif'
	}, options);

	return util.format('%s %s %s %s %s',
		options.style,
		options.variant,
		options.weight,
		options.size,
		options.family);
};

var initialize = function() {
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');

	context.textBaseline = 'baseline';
	context.fillStyle = 'rgba(0, 0, 0, 1)';

	var height = function(text, options) {
		if(!options && typeof text === 'object') {
			options = text;
			text = null;
		}

		text = (typeof text !== 'string') ? 'Mg' : text;
		options = options || {};

		var size = ('size' in options) ? px(options.size) : 16;
		options.size = size + 'px';

		context.font = font(options);

		var width = textWidth(text, options);

		if(!width || !size) return empty(size);

		context.fillText(text, 0, size);
		context.fillText(text, width, 0);

		var image = context.getImageData(0, 0, width * 2, size);
		var ascent = 0;
		var descent = 0;

		outer:
		for(var i = 0; i < image.height; i++) {
			for(var j = 0; j < image.width; j++) {
				var value = image.data[i * (image.width * 4) + j * 4 + 3];

				if(!value) continue;

				if(j < width && !ascent) ascent = i;
				else if(j >= width) descent = i;

				if(ascent && descent) break outer;
			}
		}

		ascent = size - ascent;
		context.clearRect(0, 0, width * 2 + CLEAR_PADDING,
			size + descent + CLEAR_PADDING);

		return {
			ascent: ascent,
			descent: descent,
			height: ascent + descent,
			size: size
		};
	};

	height.supported = true;
	return height;
};

module.exports = supported() ? initialize() : (function() {
	var height = function() {
		return empty();
	};

	height.supported = false;
	return height;
}());
