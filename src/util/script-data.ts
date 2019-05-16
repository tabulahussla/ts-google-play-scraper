import R from "ramda";

export const SCRIPT_REGEXP = />AF_initDataCallback[\s\S]*?<\/script/g;
export const KEY_REGEXP = /(ds:.*?)'/;
export const VALUE_REGEXP = /return ([\s\S]*?)}}\);<\//;

export function extractor(mappings) {
	/*
	 * Map the MAPPINGS object, applying each field spec to the parsed data.
	 * If the mapping value is an array, use it as the path to the extract the
	 * field's value. If it's an object, extract the value in object.path and pass
	 * it to the function in object.fun
	 */
	return function extractFields(parsedData) {
		return R.map(spec => {
			if (R.is(Array, spec)) {
				return R.path(spec, parsedData);
			}
			// assume spec object
			const input = R.path(spec.path, parsedData);
			return spec.fun(input);
		}, mappings);
	};
}

/*
 * Extract the javascript objects returned by the AF_initDataCallback functions
 * in the script tags of the app detail HTML.
 */
export function parse(response) {
	const matches = response.match(SCRIPT_REGEXP);

	if (!matches) {
		return {};
	}

	return matches.reduce((accum, data) => {
		const keyMatch = data.match(KEY_REGEXP);
		const valueMatch = data.match(VALUE_REGEXP);

		if (keyMatch && valueMatch) {
			const key = keyMatch[1];
			const value = JSON.parse(valueMatch[1]);
			return R.assoc(key, value, accum);
		}
		return accum;
	}, {});
}
