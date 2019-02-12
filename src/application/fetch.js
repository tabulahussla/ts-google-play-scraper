import qs from "querystring";
import axios from "axios";

export const BASE_URL = "https://play.google.com/store/apps/details?";

/**
 * @export
 * @param {import("google-play-scraping").ApplicationRequest} options
 * @returns {Promise<string>}
 */
export default async function fetchApplication({ storeId, languageCode, countryCode, options }) {
	const requestUrl =
		BASE_URL +
		qs.stringify({
			hl: languageCode,
			gl: countryCode,
			id: storeId,
		});
	const response = await axios.get(requestUrl, {
		responseType: "text",
		...(options || {}),
	});

	return response.data;
}
