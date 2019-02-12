"use strict";

import cheerio from "cheerio";
import R from "ramda";
import parseDate from "util/parse-date";

export const STORE_ID_REGEXP = /\?id=(.*)/;

export const MAPPINGS = {
	storeId: {
		path: ["ds:4", 0, 3, 0, 1],
		fun: extractStoreId,
	},

	title: ["ds:5", 0, 0, 0],
	description: {
		path: ["ds:5", 0, 10, 0, 1],
		fun: descriptionText,
	},
	descriptionHTML: ["ds:5", 0, 10, 0, 1],
	summary: ["ds:5", 0, 10, 1, 1],
	formattedInstalls: ["ds:5", 0, 12, 9, 0],
	minInstalls: {
		path: ["ds:5", 0, 12, 9, 0],
		fun: cleanInt,
	},
	score: ["ds:7", 0, 6, 0, 1],
	formattedScore: ["ds:7", 0, 6, 0, 0],
	ratings: ["ds:7", 0, 6, 2, 1],
	reviews: ["ds:7", 0, 6, 3, 1],
	histogram: {
		path: ["ds:7", 0, 6, 1],
		fun: buildHistogram,
	},

	numericPrice: {
		path: ["ds:3", 0, 2, 0, 0, 0, 1, 0, 0],
		fun: val => val / 1000000 || 0,
	},
	isFree: {
		path: ["ds:3", 0, 2, 0, 0, 0, 1, 0, 0],
		// considered free only if price is exactly zero
		fun: val => val === 0,
	},
	currency: ["ds:3", 0, 2, 0, 0, 0, 1, 0, 1],
	formattedPrice: {
		path: ["ds:3", 0, 2, 0, 0, 0, 1, 0, 2],
		fun: priceText,
	},
	offersIAP: {
		path: ["ds:5", 0, 12, 12, 0],
		fun: Boolean,
	},

	bundleSize: ["ds:8", 0],
	requiredOSVersion: ["ds:8", 2],

	developerName: ["ds:5", 0, 12, 5, 1],
	developerId: {
		path: ["ds:5", 0, 12, 5, 5, 4, 2],
		fun: devUrl => devUrl.split("id=")[1],
	},
	developerEmail: ["ds:5", 0, 12, 5, 2, 0],
	developerWebsite: ["ds:5", 0, 12, 5, 3, 5, 2],
	developerAddress: ["ds:5", 0, 12, 5, 4, 0],
	privacyPolicy: ["ds:5", 0, 12, 7, 2],
	primaryCategory: ["ds:5", 0, 12, 13, 0, 0],
	primaryCategoryId: ["ds:5", 0, 12, 13, 0, 2],
	familyCategory: ["ds:5", 0, 12, 13, 1, 0],
	familyCategoryId: ["ds:5", 0, 12, 13, 1, 2],

	icon: ["ds:5", 0, 12, 1, 3, 2],
	headerImage: ["ds:5", 0, 12, 2, 3, 2],
	screenshots: {
		path: ["ds:5", 0, 12, 0],
		fun: R.map(R.path([3, 2])),
	},
	video: ["ds:5", 0, 12, 3, 0, 3, 2],
	videoImage: ["ds:5", 0, 12, 3, 1, 3, 2],

	contentRating: ["ds:5", 0, 12, 4, 0],
	contentRatingDescription: ["ds:5", 0, 12, 4, 2, 1],
	adSupported: {
		path: ["ds:5", 0, 12, 14, 0],
		fun: Boolean,
	},

	released: {
		path: ["ds:5", 0, 12, 36],
		fun: parseReleaseDate,
	},
	updated: {
		path: ["ds:5", 0, 12, 8, 0],
		fun: ts => new Date(ts * 1000),
	},

	version: ["ds:8", 1],
	changelog: ["ds:5", 0, 12, 6, 1],
};

/*
 * Map the MAPPINGS object, applying each field spec to the parsed data.
 * If the mapping value is an array, use it as the path to the extract the
 * field's value. If it's an object, extract the value in object.path and pass
 * it to the function in object.fun
 */
export function extractMappedApplication(scriptData, request) {
	return R.map(extractor(scriptData, request), MAPPINGS);
}

/**
 * @export
 * @param {Object} scriptData
 * @param {import("google-play-scraping").ApplicationRequest} request
 * @returns {(spec:Array|{path:Array,fun:Function}) => void}
 */
export function extractor(scriptData, request) {
	return spec => {
		if (Array.isArray(spec)) {
			return R.path(spec, scriptData);
		}
		// assume spec object
		const input = R.path(spec.path, scriptData);
		return spec.fun(input, request);
	};
}

export function extractLanguageList(container) {
	return container.map(val => val[0]).slice(1);
}

export function parseReleaseDate(text = "", { languageCode }) {
	return parseDate(text, languageCode);
}

export function descriptionText(description = "") {
	// preserve the line breaks when converting to text
	const html = cheerio.load("<div>" + description.replace(/<br>/g, "\r\n") + "</div>");
	return cheerio.text(html("div"));
}

export function extractStoreId(storeUrl) {
	const [, storeId = ""] = storeUrl.match(STORE_ID_REGEXP) || [];

	return storeId;
}

export function priceText(text) {
	// Return Free if the price text is empty
	if (!text) {
		return "Free";
	}
	return text;
}

export function cleanInt(number) {
	number = number || "0";
	number = number.replace(/[^\d]/g, ""); // removes thousands separator
	return parseInt(number);
}

export function normalizeAndroidVersion(androidVersionText) {
	const number = androidVersionText.split(" ")[0];
	if (parseFloat(number)) {
		return number;
	}
	return "VARY";
}

export function buildHistogram(container) {
	if (!container) {
		return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
	}
	return {
		1: container[1][1],
		2: container[2][1],
		3: container[3][1],
		4: container[4][1],
		5: container[5][1],
	};
}
