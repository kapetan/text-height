# text-height

A utility for measuring actual text height in browsers supporting the canvas API.

While the `font-size` property specifies the height of a text string, this height is usually a bit larger than the distance from the tallest ascender to the lowest descender. This module calculates the exact height of a string using the [context.getImageData][gid] function by iterating over the raw pixel data.

# Usage

Install through `npm` and require it with `browserify`.

```javascript
var height = require('text-height');

var h = height('my string', {
	family: 'Arial',
	size: 16
});
```

The function returns an object containing the different distances. E.g.

```javascript
{
	ascent: 12, // The ascent above the baseline
	descent: 3, // The descent below the baseline
	height: 15, // Height in total
	size: 16 // font-size in pixels
}
```

It supports following font options, `style`, `variant`, `weight`, `size` and `family`. Each corresponding to a similarly named [CSS property][font]. The size option can either be a number (size in pixels) or a string, e.g. `10pt`, but passing a relative length or keyword will return a height of zero.

The text string is optional and when omitted it defaults to `Mg`.

[gid]: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.getImageData
[font]: https://developer.mozilla.org/en-US/docs/Web/CSS/font
