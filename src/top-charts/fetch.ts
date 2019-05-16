import qs from "querystring";
import { TopChartsInternalRequest } from "~/typedef/top-charts";
import httpRequest from "~/util/http-request";

export const BASE_URL = "https://play.google.com/store/apps";
export const FAMILY_REGEXP = /^FAMILY_?/;
export const AGE_REGEXP = /(_UNDER_5|_6_TO_8|_9_AND_UP)$/;
export const AGE_MAP = {
	_UNDER_5: "AGE_RANGE1",
	_6_TO_8: "AGE_RANGE2",
	_9_AND_UP: "AGE_RANGE3",
};

export function topChartsUrl({
	category,
	collection,
	countryCode,
	languageCode,
	num = 20,
}: any) {
	const query: any = {
		hl: languageCode,
		gl: countryCode,
		num,
	};
	const age = categoryAge(category);
	if (age) {
		query.age = age;
		category = category.replace(AGE_REGEXP, "");
	}

	let url = BASE_URL;

	if (category && category !== "OVERALL") {
		url += `/category/${category}`;
	}
	url += `/collection/${collection}`;

	return `${url}?${qs.stringify(query)}`;
}

export function categoryAge(category) {
	if (FAMILY_REGEXP.test(category) && AGE_REGEXP.test(category)) {
		const [, age = void 0] = category.match(AGE_REGEXP) || [];
		return AGE_MAP[age];
	}
}

export default async function fetchTopCharts({
	category,
	collection,
	languageCode,
	countryCode,
	options = {},
	start = 0,
	num,
} : TopChartsInternalRequest) {
	const requestUrl = topChartsUrl({
		category,
		collection,
		languageCode,
		countryCode,
		num,
	});
	const response = await httpRequest({
		url: requestUrl,
		method: "POST",
		...(options || {}),
		headers: {
			...(options.headers || {}),
			"content-type": "application/x-www-form-urlencoded",
		},
		data: qs.stringify({
			start,
		}),
	});

	return response.data;
}
