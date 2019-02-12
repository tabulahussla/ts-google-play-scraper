import R from "ramda";

export const INIT_DATA_REGEXP = />AF_initDataCallback[\s\S]*?<\/script/g;
export const KEY_REGEXP = /(ds:.*?)'/;
export const VALUE_REGEXP = /return ([\s\S]*?)}}\);<\//;

/**
 * Extract the javascript objects returned by the AF_initDataCallback functions
 * in the script tags of the app detail HTML.
 *
 * @param {string} html
 * @returns {Object}
 */
export function extractScriptData(html = "") {
	return (html.match(INIT_DATA_REGEXP) || []).reduce((accum, data) => {
		let [, key = void 0] = data.match(KEY_REGEXP) || [];
		let [, value = void 0] = data.match(VALUE_REGEXP) || [];

		if (key && value) {
			value = JSON.parse(value);
			return R.assoc(key, value, accum);
		}

		return accum;
	}, {});
}
