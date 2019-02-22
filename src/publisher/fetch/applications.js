import qs from "querystring";
import httpRequest from "util/http-request";
import rawStringify from "util/stringify-raw";
import debug from "util/debug";

export const BASE_URL = "https://play.google.com/store/apps/developer";

// the pagination algorithm is very similar to search, so there's some -acceptable-
// duplication. look out for chances to factor common stuff
export function extractPageToken(html) {
	const [s = void 0] = html.match(/\\x22GAE(.*?):S:(.*?)\\x22/g) || [];
	return s && s.replace(/\\\\u003d/g, "=").replace(/\\x22/g, "");
}

/**
 * @export
 * @param {import("@xxorg/google-play-scraping").PublisherRequest} options
 * @returns {string}
 */
export function publisherUrl({ storeId, languageCode, countryCode }) {
	const query = {
		id: storeId,
		hl: languageCode,
		gl: countryCode,
	};
	const url = `${BASE_URL}?${qs.stringify(query)}`;

	debug("PUBLISHER URL", url);

	return url;
}

/**
 * @export
 * @param {import("@xxorg/google-play-scraping").PublisherRequest&{pageToken:string,num:number,start:number}} options
 * @returns {Promise<string>}
 */
export async function nextPageRequest({
	storeId,
	languageCode,
	countryCode,
	options = {},
	num = 120,
	start = 0,
	pageToken,
}) {
	debug("PUBLISHER NEXT PAGE REQUEST %o", arguments[0]);

	const response = await httpRequest({
		url: publisherUrl({ storeId, languageCode, countryCode }),
		method: "POST",
		...(options || {}),
		headers: {
			...(options.headers || {}),
			"content-type": "application/x-www-form-urlencoded",
		},
		data: rawStringify({
			num,
			start,
			pagTok: pageToken,
			pagtt: 1,
			hl: languageCode,
			gl: countryCode,
		}),
	});

	return response.data;
}

/**
 * @export
 * @param {import("@xxorg/google-play-scraping").PublisherRequest} options
 * @returns {Promise<string>}
 */
export async function initialRequest({ storeId, languageCode, countryCode, options }) {
	debug("PUBLISHER INITIAL REQUEST %o", arguments[0]);

	const response = await httpRequest({
		url: publisherUrl({ storeId, languageCode, countryCode }),
		method: "GET",
		...(options || {}),
	});

	return response.data;
}
