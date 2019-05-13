import qs from "querystring";
import httpRequest from "util/http-request";
import rawStringify from "util/stringify-raw";
import debug from "util/debug";

export const BASE_URL = "https://play.google.com/store/search";
export const CLUSTER_PAGE_URL = "https://play.google.com/store/apps/collection/search_results_cluster_apps";
export const CLUSTER_REGEXP = /href="\/store\/apps\/collection\/search_collection_more_results_cluster?(.*?)"/;

export async function skipClusterPage(response, options) {
	const [match = void 0] = response.data.match(CLUSTER_REGEXP) || [];
	if (match) {
		const innerUrl = "https://play.google.com/" + match.split(/"/)[1];
		response = await httpRequest({
			url: innerUrl,
			...(options || {}),
		});
		debug("skipClusterPage %s", innerUrl);
	}
	return response.data;
}

export function extractClp(html) {
	// Try to find clp from "next page" html elem.
	let [, match = void 0] = html.match(/\?clp=(.*?)">/) || [];
	// ... if we don't have it, we're probably on innerPage;
	// try to parse it from search_collection_more_results_cluster instead
	// var curl=`
	//   https://play.google.com/store/apps/collection/
	//   search_collection_more_results_cluster
	//   ?clp\x3dggENCgVwYW5kYRABGgIIAA%3D%3D:S:ANO1ljKV8KM
	// `;
	if (!match) [, match = void 0] = html.match(/\?clp\\x3d(.*?)';/) || [];
	return match && match.replace(/%3D/g, "=");
}
export function extractPageToken(html) {
	// extract the token for the next page request
	const [s = void 0] = html.match(/\\x22-p6(.*?):S:(.*?)\\x22/g) || [];
	return s && s.replace(/\\\\u003d/g, "=").replace(/\\x22/g, "");
}

/**
 * @export
 * @param {import("@xxorg/google-play-scraping").SearchRequest&{pageToken:string,clp:string,num:number,start:number}} options
 * @returns {Promise<string>}
 */
export async function nextPageRequest({ pageToken, clp, languageCode, countryCode, num, start, options = {} }) {
	debug("nextPageRequest");
	const response = await httpRequest({
		url: CLUSTER_PAGE_URL,
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
			clp,
			pagtt: 3,
			hl: languageCode,
			gl: countryCode,
		}),
	});

	return response.data;
}

/**
 * @export
 * @param {import("@xxorg/google-play-scraping").SearchRequest} options
 * @returns {Promise<string>}
 */
export default async function initialRequest({ term, languageCode, countryCode, pricing, options }) {
	const query = {
		c: "apps",
		q: term,
		hl: languageCode,
		gl: countryCode,
	};
	if (pricing) {
		query.price = pricing;
	}
	const requestUrl = `${BASE_URL}?${qs.stringify(query)}`;
	debug("initial request");
	const response = await httpRequest({
		url: requestUrl,
		...(options || {}),
	});
	debug("skip cluster page");
	const html = await skipClusterPage(response, options);

	return html;
}
