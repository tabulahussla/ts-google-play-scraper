import qs from "querystring";
import httpRequest from "util/http-request";
import debug from "util/debug";
import R from "ramda";
import { parse } from "util/script-data";

export const BASE_URL = "https://play.google.com/store/search";
export const NEXT_URL =
	"https://play.google.com/_/PlayStoreUi/data/batchexecute?rpcids=qnKhOb&bl=boq_playu" +
	"iserver_20190424.04_p0&hl=en&gl=us&authuser=0&soc-app=121&soc-platform=1&soc-device=1";
export const CLUSTER_PAGE_URL = "https://play.google.com/store/apps/collection/search_results_cluster_apps";
export const CLUSTER_REGEXP = /href="\/store\/apps\/collection\/search_collection_more_results_cluster?(.*?)"/;
export const BODY =
	"f.req=%5B%5B%5B%22qnKhOb%22%2C%22%5B%5Bnull%2C%5B%5B10%2C%5B10%2C50%5D%5D%2Ctrue%2" +
	"Cnull%2C%5B96%2C27%2C4%2C8%2C57%2C30%2C110%2C79%2C11%2C16%2C49%2C1%2C3%2C9%2C12%2C" +
	"104%2C55%2C56%2C51%2C10%2C34%2C77%5D%5D%2Cnull%2C%5C%22%token%%5C%22%5D%5D%22%2Cnu" +
	"ll%2C%22generic%22%5D%5D%5D";

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

export function extractToken(root, data) {
	return R.path(root, data);
}

/**
 * @export
 * @param {import("@xxorg/google-play-scraping").SearchRequest&{token:string}} options
 * @returns {Promise<string>}
 */
export async function nextPageRequest({ token, options = {} }) {
	debug("nextPageRequest");
	const response = await httpRequest({
		url: NEXT_URL,
		method: "POST",
		data: BODY.replace("%token%", token),
		...(options || {}),
		headers: {
			...(options.headers || {}),
			"content-type": "application/x-www-form-urlencoded;charset=UTF-8",
		},
	});
	const html = response.data;
	const input = JSON.parse(html.substring(5));
	const data = JSON.parse(input[0][2]);

	return data;
}

/**
 * @export
 * @param {import("@xxorg/google-play-scraping").SearchRequest} options
 * @returns {Promise<ScriptData>}
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

	return parse(html);
}
