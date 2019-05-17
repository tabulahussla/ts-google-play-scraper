import { AxiosRequestConfig, AxiosResponse } from "axios";
import { writeFile } from "fs-extra";
import qs from "querystring";
import R from "ramda";
import { SearchRequest } from "~/typedef/search";
import debug from "~/util/debug";
import httpRequest from "~/util/http-request";
import { parse } from "~/util/script-data";

export const BASE_URL = "https://play.google.com/store/search";
export const NEXT_URL =
	"https://play.google.com/_/PlayStoreUi/data/batchexecute?rpcids=qnKhOb&f.sid=%fSid%&bl=boq_playu" +
	"iserver_20190424.04_p0&hl=%hl%&gl=%gl%&authuser=0&soc-app=121&soc-platform=1&soc-device=1&_reqid=%reqId%&rt=c";
export const CLUSTER_PAGE_URL =
	"https://play.google.com/store/apps/collection/search_results_cluster_apps";
export const CLUSTER_REGEXP = /href="\/store\/apps\/collection\/search_collection_more_results_cluster?(.*?)"/;
export const BODY =
	"f.req=%5B%5B%5B%22qnKhOb%22%2C%22%5B%5Bnull%2C%5B%5B10%2C%5B10%2C50%5D%5D%2Ctrue%2" +
	"Cnull%2C%5B96%2C27%2C4%2C8%2C57%2C30%2C110%2C79%2C11%2C16%2C49%2C1%2C3%2C9%2C12%2C" +
	"104%2C55%2C56%2C51%2C10%2C34%2C77%5D%5D%2Cnull%2C%5C%22%token%%5C%22%5D%5D%22%2Cnu" +
	"ll%2C%22generic%22%5D%5D%5D";
export const SESSION_ID_REGEXP = /id="_gd".*?:"(-?\d+?)","/;

export async function skipClusterPage(response: AxiosResponse, options: any) {
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

export function extractToken(root: any, data: any): string {
	return R.path(root, data) as string;
}

export function extractSessionId(html: string): string {
	const [sessionId = ""] = html.match(SESSION_ID_REGEXP) || [];

	return sessionId;
}

export async function nextPageRequest({
	token,
	sessionId,
	requestId,
	requestNumber,
	languageCode = "en",
	countryCode = "us",
	options = {},
}: {
	requestNumber: number;
	token: string;
	sessionId: string;
	requestId: string;
	languageCode?: string;
	countryCode?: string;
	options?: AxiosRequestConfig;
}) {
	debug(
		"nextPageRequest %s",
		(requestNumber > 0 ? requestNumber : "") + requestId
	);
	const response = await httpRequest({
		url: NEXT_URL.replace("%fSid%", sessionId)
			.replace(
				"%reqId%",
				(requestNumber > 0 ? requestNumber : "") + requestId
			)
			.replace("%hl%", languageCode)
			.replace("%gl%", countryCode),
		method: "POST",
		data: BODY.replace("%token%", token),
		...(options || {}),
		headers: {
			...(options.headers || {}),
			"content-type": "application/x-www-form-urlencoded;charset=UTF-8",
		},
	});
	const html = response.data;
	const offset = +html.substring(5, 11).trim();
	const input = JSON.parse(html.substr(12, offset - 1));
	const data = JSON.parse(input[0][2]);

	return data;
}

export default async function initialRequest({
	term,
	languageCode,
	countryCode,
	pricing,
	options,
}: SearchRequest) {
	const query: any = {
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

	return [parse(html), html];
}
