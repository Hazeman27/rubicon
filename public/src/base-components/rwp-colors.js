/**
 * @typedef {(
 * 'pink' |
 * 'lightpink' |
 * 'hotpink' |
 * 'deeppink' |
 * 'palevioletred' |
 * 'mediumvioletred' |
 * 'lightsalmon' |
 * 'salmon' |
 * 'darksalmon' |
 * 'lightcoral' |
 * 'indianred' |
 * 'crimson' |
 * 'firebrick' |
 * 'darkred' |
 * 'red' |
 * 'orangered' |
 * 'tomato' |
 * 'coral' |
 * 'darkorange' |
 * 'orange' |
 * 'yellow' |
 * 'lightyellow' |
 * 'lemonchiffon' |
 * 'lightgoldenrodyellow' |
 * 'papayawhip' |
 * 'moccasin' |
 * 'peachpuff' |
 * 'palegoldenrod' |
 * 'khaki' |
 * 'darkkhaki' |
 * 'gold' |
 * 'cornsilk' |
 * 'blanchedalmond' |
 * 'bisque' |
 * 'navajowhite' |
 * 'wheat' |
 * 'burlywood' |
 * 'tan' |
 * 'rosybrown' |
 * 'sandybrown' |
 * 'goldenrod' |
 * 'darkgoldenrod' |
 * 'peru' |
 * 'chocolate' |
 * 'saddlebrown' |
 * 'sienna' |
 * 'brown' |
 * 'maroon' |
 * 'darkolivegreen' |
 * 'olive' |
 * 'olivedrab' |
 * 'yellowgreen' |
 * 'limegreen' |
 * 'lime' |
 * 'lawngreen' |
 * 'chartreuse' |
 * 'greenyellow' |
 * 'springgreen' |
 * 'mediumspringgreen' |
 * 'lightgreen' |
 * 'palegreen' |
 * 'darkseagreen' |
 * 'mediumaquamarine' |
 * 'mediumseagreen' |
 * 'seagreen' |
 * 'forestgreen' |
 * 'green' |
 * 'darkgreen' |
 * 'aqua' |
 * 'cyan' |
 * 'lightcyan' |
 * 'paleturquoise' |
 * 'aquamarine' |
 * 'turquoise' |
 * 'mediumturquoise' |
 * 'darkturquoise' |
 * 'lightseagreen' |
 * 'cadetblue' |
 * 'darkcyan' |
 * 'teal' |
 * 'lightsteelblue' |
 * 'powderblue' |
 * 'lightblue' |
 * 'skyblue' |
 * 'lightskyblue' |
 * 'deepskyblue' |
 * 'dodgerblue' |
 * 'cornflowerblue' |
 * 'steelblue' |
 * 'royalblue' |
 * 'blue' |
 * 'mediumblue' |
 * 'darkblue' |
 * 'navy' |
 * 'midnightblue' |
 * 'lavender' |
 * 'thistle' |
 * 'plum' |
 * 'violet' |
 * 'orchid' |
 * 'fuchsia' |
 * 'magenta' |
 * 'mediumorchid' |
 * 'mediumpurple' |
 * 'blueviolet' |
 * 'darkviolet' |
 * 'darkorchid' |
 * 'darkmagenta' |
 * 'purple' |
 * 'indigo' |
 * 'darkslateblue' |
 * 'slateblue' |
 * 'mediumslateblue' |
 * 'white' |
 * 'snow' |
 * 'honeydew' |
 * 'mintcream' |
 * 'azure' |
 * 'aliceblue' |
 * 'ghostwhite' |
 * 'whitesmoke' |
 * 'seashell' |
 * 'beige' |
 * 'oldlace' |
 * 'floralwhite' |
 * 'ivory' |
 * 'antiquewhite' |
 * 'linen' |
 * 'lavenderblush' |
 * 'mistyrose' |
 * 'gainsboro' |
 * 'lightgray' |
 * 'silver' |
 * 'darkgray' |
 * 'gray' |
 * 'dimgray' |
 * 'lightslategray' |
 * 'slategray' |
 * 'darkslategray' |
 * 'black')} WebColor
 */

/**
 * @typedef {object} ColorInfo
 * @property {string} hex
 * @property {number[]} rgb
 */

/**
 * @readonly
 * @type {Object.<string, ColorInfo>} Named web colors with their hexadecimal
 * and rgb values.
 */

export const COLORS = {
	pink: {
		hex: '#ffc0cb',
		rgb: [255, 192, 203]
	},
	lightpink: {
		hex: '#ffb6c1',
		rgb: [255, 182, 193]
	},
	hotpink: {
		hex: '#ff69b4',
		rgb: [255, 105, 180]
	},
	deeppink: {
		hex: '#ff1493',
		rgb: [255, 20, 147]
	},
	palevioletred: {
		hex: '#db7093',
		rgb: [219, 112, 147]
	},
	mediumvioletred: {
		hex: '#c71585',
		rgb: [199, 21, 133]
	},
	lightsalmon: {
		hex: '#ffa07a',
		rgb: [255, 160, 122]
	},
	salmon: {
		hex: '#fa8072',
		rgb: [250, 128, 114]
	},
	darksalmon: {
		hex: '#e9967a',
		rgb: [233, 150, 122]
	},
	lightcoral: {
		hex: '#f08080',
		rgb: [240, 128, 128]
	},
	indianred: {
		hex: '#cd5c5c',
		rgb: [205, 92, 92]
	},
	crimson: {
		hex: '#dc143c',
		rgb: [220, 20, 60]
	},
	firebrick: {
		hex: '#b22222',
		rgb: [178, 34, 34]
	},
	darkred: {
		hex: '#8b0000',
		rgb: [139, 0, 0]
	},
	red: {
		hex: '#ff0000',
		rgb: [255, 0, 0]
	},
	orangered: {
		hex: '#ff4500',
		rgb: [255, 69, 0]
	},
	tomato: {
		hex: '#ff6347',
		rgb: [255, 99, 71]
	},
	coral: {
		hex: '#ff7f50',
		rgb: [255, 127, 80]
	},
	darkorange: {
		hex: '#ff8c00',
		rgb: [255, 140, 0]
	},
	orange: {
		hex: '#ffa500',
		rgb: [255, 165, 0]
	},
	yellow: {
		hex: '#ffff00',
		rgb: [255, 255, 0]
	},
	lightyellow: {
		hex: '#ffffe0',
		rgb: [255, 255, 224]
	},
	lemonchiffon: {
		hex: '#fffacd',
		rgb: [255, 250, 205]
	},
	lightgoldenrodyellow: {
		hex: '#fafad2',
		rgb: [250, 250, 210]
	},
	papayawhip: {
		hex: '#ffefd5',
		rgb: [255, 239, 213]
	},
	moccasin: {
		hex: '#ffe4b5',
		rgb: [255, 228, 181]
	},
	peachpuff: {
		hex: '#ffdab9',
		rgb: [255, 218, 185]
	},
	palegoldenrod: {
		hex: '#eee8aa',
		rgb: [238, 232, 170]
	},
	khaki: {
		hex: '#f0e68c',
		rgb: [240, 230, 140]
	},
	darkkhaki: {
		hex: '#bdb76b',
		rgb: [189, 183, 107]
	},
	gold: {
		hex: '#ffd700',
		rgb: [255, 215, 0]
	},
	cornsilk: {
		hex: '#fff8dc',
		rgb: [255, 248, 220]
	},
	blanchedalmond: {
		hex: '#ffebcd',
		rgb: [255, 235, 205]
	},
	bisque: {
		hex: '#ffe4c4',
		rgb: [255, 228, 196]
	},
	navajowhite: {
		hex: '#ffdead',
		rgb: [255, 222, 173]
	},
	wheat: {
		hex: '#f5deb3',
		rgb: [245, 222, 179]
	},
	burlywood: {
		hex: '#deb887',
		rgb: [222, 184, 135]
	},
	tan: {
		hex: '#d2b48c',
		rgb: [210, 180, 140]
	},
	rosybrown: {
		hex: '#bc8f8f',
		rgb: [188, 143, 143]
	},
	sandybrown: {
		hex: '#f4a460',
		rgb: [244, 164, 96]
	},
	goldenrod: {
		hex: '#daa520',
		rgb: [218, 165, 32]
	},
	darkgoldenrod: {
		hex: '#b8860b',
		rgb: [184, 134, 11]
	},
	peru: {
		hex: '#cd853f',
		rgb: [205, 133, 63]
	},
	chocolate: {
		hex: '#d2691e',
		rgb: [210, 105, 30]
	},
	saddlebrown: {
		hex: '#8b4513',
		rgb: [139, 69, 19]
	},
	sienna: {
		hex: '#a0522d',
		rgb: [160, 82, 45]
	},
	brown: {
		hex: '#a52a2a',
		rgb: [165, 42, 42]
	},
	maroon: {
		hex: '#800000',
		rgb: [128, 0, 0]
	},
	darkolivegreen: {
		hex: '#556b2f',
		rgb: [85, 107, 47]
	},
	olive: {
		hex: '#808000',
		rgb: [128, 128, 0]
	},
	olivedrab: {
		hex: '#6b8e23',
		rgb: [107, 142, 35]
	},
	yellowgreen: {
		hex: '#9acd32',
		rgb: [154, 205, 50]
	},
	limegreen: {
		hex: '#32cd32',
		rgb: [50, 205, 50]
	},
	lime: {
		hex: '#00ff00',
		rgb: [0, 255, 0]
	},
	lawngreen: {
		hex: '#7cfc00',
		rgb: [124, 252, 0]
	},
	chartreuse: {
		hex: '#7fff00',
		rgb: [127, 255, 0]
	},
	greenyellow: {
		hex: '#adff2f',
		rgb: [173, 255, 47]
	},
	springgreen: {
		hex: '#00ff7f',
		rgb: [0, 255, 127]
	},
	mediumspringgreen: {
		hex: '#00fa9a',
		rgb: [0, 250, 154]
	},
	lightgreen: {
		hex: '#90ee90',
		rgb: [144, 238, 144]
	},
	palegreen: {
		hex: '#98fb98',
		rgb: [152, 251, 152]
	},
	darkseagreen: {
		hex: '#8fbc8f',
		rgb: [143, 188, 143]
	},
	mediumaquamarine: {
		hex: '#66cdaa',
		rgb: [102, 205, 170]
	},
	mediumseagreen: {
		hex: '#3cb371',
		rgb: [60, 179, 113]
	},
	seagreen: {
		hex: '#2e8b57',
		rgb: [46, 139, 87]
	},
	forestgreen: {
		hex: '#228b22',
		rgb: [34, 139, 34]
	},
	green: {
		hex: '#008000',
		rgb: [0, 128, 0]
	},
	darkgreen: {
		hex: '#006400',
		rgb: [0, 100, 0]
	},
	aqua: {
		hex: '#00ffff',
		rgb: [0, 255, 255]
	},
	cyan: {
		hex: '#00ffff',
		rgb: [0, 255, 255]
	},
	lightcyan: {
		hex: '#e0ffff',
		rgb: [224, 255, 255]
	},
	paleturquoise: {
		hex: '#afeeee',
		rgb: [175, 238, 238]
	},
	aquamarine: {
		hex: '#7fffd4',
		rgb: [127, 255, 212]
	},
	turquoise: {
		hex: '#40e0d0',
		rgb: [64, 224, 208]
	},
	mediumturquoise: {
		hex: '#48d1cc',
		rgb: [72, 209, 204]
	},
	darkturquoise: {
		hex: '#00ced1',
		rgb: [0, 206, 209]
	},
	lightseagreen: {
		hex: '#20b2aa',
		rgb: [32, 178, 170]
	},
	cadetblue: {
		hex: '#5f9ea0',
		rgb: [95, 158, 160]
	},
	darkcyan: {
		hex: '#008b8b',
		rgb: [0, 139, 139]
	},
	teal: {
		hex: '#008080',
		rgb: [0, 128, 128]
	},
	lightsteelblue: {
		hex: '#b0c4de',
		rgb: [176, 196, 222]
	},
	powderblue: {
		hex: '#b0e0e6',
		rgb: [176, 224, 230]
	},
	lightblue: {
		hex: '#add8e6',
		rgb: [173, 216, 230]
	},
	skyblue: {
		hex: '#87ceeb',
		rgb: [135, 206, 235]
	},
	lightskyblue: {
		hex: '#87cefa',
		rgb: [135, 206, 250]
	},
	deepskyblue: {
		hex: '#00bfff',
		rgb: [0, 191, 255]
	},
	dodgerblue: {
		hex: '#1e90ff',
		rgb: [30, 144, 255]
	},
	cornflowerblue: {
		hex: '#6495ed',
		rgb: [100, 149, 237]
	},
	steelblue: {
		hex: '#4682b4',
		rgb: [70, 130, 180]
	},
	royalblue: {
		hex: '#4169e1',
		rgb: [65, 105, 225]
	},
	blue: {
		hex: '#0000ff',
		rgb: [0, 0, 255]
	},
	mediumblue: {
		hex: '#0000cd',
		rgb: [0, 0, 205]
	},
	darkblue: {
		hex: '#00008b',
		rgb: [0, 0, 139]
	},
	navy: {
		hex: '#000080',
		rgb: [0, 0, 128]
	},
	midnightblue: {
		hex: '#191970',
		rgb: [25, 25, 112]
	},
	lavender: {
		hex: '#e6e6fa',
		rgb: [230, 230, 250]
	},
	thistle: {
		hex: '#d8bfd8',
		rgb: [216, 191, 216]
	},
	plum: {
		hex: '#dda0dd',
		rgb: [221, 160, 221]
	},
	violet: {
		hex: '#ee82ee',
		rgb: [238, 130, 238]
	},
	orchid: {
		hex: '#da70d6',
		rgb: [218, 112, 214]
	},
	fuchsia: {
		hex: '#ff00ff',
		rgb: [255, 0, 255]
	},
	magenta: {
		hex: '#ff00ff',
		rgb: [255, 0, 255]
	},
	mediumorchid: {
		hex: '#ba55d3',
		rgb: [186, 85, 211]
	},
	mediumpurple: {
		hex: '#9370db',
		rgb: [147, 112, 219]
	},
	blueviolet: {
		hex: '#8a2be2',
		rgb: [138, 43, 226]
	},
	darkviolet: {
		hex: '#9400d3',
		rgb: [148, 0, 211]
	},
	darkorchid: {
		hex: '#9932cc',
		rgb: [153, 50, 204]
	},
	darkmagenta: {
		hex: '#8b008b',
		rgb: [139, 0, 139]
	},
	purple: {
		hex: '#800080',
		rgb: [128, 0, 128]
	},
	indigo: {
		hex: '#4b0082',
		rgb: [75, 0, 130]
	},
	darkslateblue: {
		hex: '#483d8b',
		rgb: [72, 61, 139]
	},
	slateblue: {
		hex: '#6a5acd',
		rgb: [106, 90, 205]
	},
	mediumslateblue: {
		hex: '#7b68ee',
		rgb: [123, 104, 238]
	},
	white: {
		hex: '#ffffff',
		rgb: [255, 255, 255]
	},
	snow: {
		hex: '#fffafa',
		rgb: [255, 250, 250]
	},
	honeydew: {
		hex: '#f0fff0',
		rgb: [240, 255, 240]
	},
	mintcream: {
		hex: '#f5fffa',
		rgb: [245, 255, 250]
	},
	azure: {
		hex: '#f0ffff',
		rgb: [240, 255, 255]
	},
	aliceblue: {
		hex: '#f0f8ff',
		rgb: [240, 248, 255]
	},
	ghostwhite: {
		hex: '#f8f8ff',
		rgb: [248, 248, 255]
	},
	whitesmoke: {
		hex: '#f5f5f5',
		rgb: [245, 245, 245]
	},
	seashell: {
		hex: '#fff5ee',
		rgb: [255, 245, 238]
	},
	beige: {
		hex: '#f5f5dc',
		rgb: [245, 245, 220]
	},
	oldlace: {
		hex: '#fdf5e6',
		rgb: [253, 245, 230]
	},
	floralwhite: {
		hex: '#fffaf0',
		rgb: [255, 250, 240]
	},
	ivory: {
		hex: '#fffff0',
		rgb: [255, 255, 240]
	},
	antiquewhite: {
		hex: '#faebd7',
		rgb: [250, 235, 215]
	},
	linen: {
		hex: '#faf0e6',
		rgb: [250, 240, 230]
	},
	lavenderblush: {
		hex: '#fff0f5',
		rgb: [255, 240, 245]
	},
	mistyrose: {
		hex: '#ffe4e1',
		rgb: [255, 228, 225]
	},
	gainsboro: {
		hex: '#dcdcdc',
		rgb: [220, 220, 220]
	},
	lightgray: {
		hex: '#d3d3d3',
		rgb: [211, 211, 211]
	},
	silver: {
		hex: '#c0c0c0',
		rgb: [192, 192, 192]
	},
	darkgray: {
		hex: '#a9a9a9',
		rgb: [169, 169, 169]
	},
	gray: {
		hex: '#808080',
		rgb: [128, 128, 128]
	},
	dimgray: {
		hex: '#696969',
		rgb: [105, 105, 105]
	},
	lightslategray: {
		hex: '#778899',
		rgb: [119, 136, 153]
	},
	slategray: {
		hex: '#708090',
		rgb: [112, 128, 144]
	},
	darkslategray: {
		hex: '#2f4f4f',
		rgb: [47, 79, 79]
	},
	black: {
		hex: '#000000',
		rgb: [0, 0, 0]
	}
};

/**
 * @param {WebColor} color
 * @returns {ColorInfo}
 */
export function getColorInfo(color) {
	return COLORS[color];
}

/**
 * @param {WebColor | string} color
 * @returns {number[] | null} rgb array: [r, g, b].
 */
export function getColorRGB(color) {
	if (getColorInfo(color))
		return COLORS[color].rgb;

	if (color.includes('#')) {
		let r, g, b;

		if (color.length !== 4 && color.length !== 7) {
			console.error('Incorrect hexadecimal color format!');
			console.error('Expected formats: #AAA or #RRGGBB. But got', color);
			return null;
		}

		if (color.length === 4 &&
			color.charAt(1) === color.charAt(2) &&
			color.charAt(2) === color.charAt(3)) {
			r = Number.parseInt(color.substring(1, 3), 16);
			g = b;
			b = g;
		} else {
			r = Number.parseInt(color.substring(1, 3), 16);
			g = Number.parseInt(color.substring(3, 5), 16);
			b = Number.parseInt(color.substring(5), 16);
		}

		return [r, g, b];
	}

	if (color.includes('rgb')) {
		return color.split(',')
			.map(portion => portion.replace(/[^0-9]/g, ''))
			.map(Number);
	}

	console.error('Incorrect color format!');
	console.error(
		'Expected #AAA, #RRGGBB, or rgba(255, 255, 255) format. But got',
		color
	);

	return null;
}

/**
 * @typedef {object} BrightnessInfo
 * @property {number} brightness
 * @property {boolean} isGood
 */
/**
 * Calculates brightness of the color.
 * @see https://www.w3.org/TR/AERT/#color-contrast
 *
 * @param {number} r value of the red channel, in range from 0 to 255
 * @param {number} g value of the green channel, in range from 0 to 255
 * @param {number} b value of the blue channel, in range from 0 to 255
 * @returns {BrightnessInfo} Contrast value. If value is higher than 125 then
 * brightness is good.
 */
export function calcColorBrightness(r, g, b) {
	const brightness = Math.round(((r * 299) + (g * 587) + (b * 114)) / 1000);
	return {
		brightness,
		isGood: brightness > 125
	};
}

/**
 * @typedef {object} DifferenceInfo
 * @property {number} difference
 * @property {boolean} isGood
 */
/**
 * Calculates two colors contrast difference.
 * @see https://www.w3.org/TR/AERT/#color-contrast
 *
 * @param {WebColor | string} foregroundColor
 * @param {WebColor | string} backgroundColor
 * @returns {DifferenceInfo | null} `DifferenceInfo` object. If its `difference` property
 * is higher than 500 then its `isGood` property is set to `true`.
 */
export function calcColorDifference(foregroundColor, backgroundColor) {
	const fg = getColorRGB(foregroundColor);
	const bg = getColorRGB(backgroundColor);

	if (!fg || !bg)
		return null;

	const difference = Math.max(fg[0], bg[0]) - Math.min(fg[0], bg[0]) +
			Math.max(fg[1], bg[1]) - Math.min(fg[1], bg[1]) +
			Math.max(fg[2], bg[2]) - Math.min(fg[2], bg[2]);

	return {
		difference,
		isGood: difference > 500
	};
}

/**
 * Calculates average color from `ImageData` object.
 *
 * Conversion from RGBA to RGB:
 * @see https://en.wikipedia.org/wiki/Alpha_compositing#Alpha_blending
 *
 * Source => Target = (BGColor + Source) =
 * Target.R = ((1 - Source.A) * BGColor.R) + (Source.A * Source.R)
 * Target.G = ((1 - Source.A) * BGColor.G) + (Source.A * Source.G)
 * Target.B = ((1 - Source.A) * BGColor.B) + (Source.A * Source.B)
 *
 * @param {ImageData} imageData
 * @param {WebColor | string} backgroundColor
 * @returns {number[] | null} rgb array: [r, g, b].
 */
export function calcAverageColorFromImageData(imageData, backgroundColor) {
	if (!imageData) return null;

	let r = 0;
	let g = 0;
	let b = 0;
	let a = 0;

	const bg = getColorRGB(backgroundColor);

	if (bg === null) return null;

	const length = imageData.data.length;
	const pixelsCount = length / 4;

	for (let i = 0; i < length; i += 4) {
		r += imageData.data[i];
		g += imageData.data[i + 1];
		b += imageData.data[i + 2];
		a += imageData.data[i + 3] / 255;
	}

	r = r / (pixelsCount / 8) | 0;
	g = g / (pixelsCount / 8) | 0;
	b = b / (pixelsCount / 8) | 0;
	a = a / (pixelsCount / 8) | 0;

	console.log(r, g, b, a, pixelsCount);

	return [
		((1 - a) * bg[0]) + (a * r),
		((1 - a) * bg[1]) + (a * g),
		((1 - a) * bg[2]) + (a * b)
	];
}
