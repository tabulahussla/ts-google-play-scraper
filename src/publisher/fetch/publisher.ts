import { stringify } from "querystring";
import httpRequest from "~/util/http-request";

export const BASE_URL = "https://play.google.com/store/apps/dev";

/**
 * @export
 * @param {import("@xxorg/google-play-scraping").PublisherRequest} options
 * @returns {Promise<string>}
 */
export async function fetchPublisherInfo({
	storeId,
	languageCode,
	countryCode,
	options,
}) {
	const url = `${BASE_URL}?${stringify({
		id: storeId,
		hl: languageCode,
		gl: countryCode,
	})}`;
	const response = await httpRequest({
		url,
		method: "GET",
		...(options || {}),
	});

	return response.data;
}
