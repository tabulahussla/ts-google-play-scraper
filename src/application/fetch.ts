import qs from "querystring";
import httpRequest from "~/util/http-request";

export const BASE_URL = "https://play.google.com/store/apps/details?";

export default async function fetchApplication({
	storeId,
	languageCode,
	countryCode,
	options,
}: ApplicationRequest): Promise<string> {
	const requestUrl =
		BASE_URL +
		qs.stringify({
			hl: languageCode,
			gl: countryCode,
			id: storeId,
		});
	const response = await httpRequest({
		url: requestUrl,
		...(options || {}),
	});

	return response.data;
}
