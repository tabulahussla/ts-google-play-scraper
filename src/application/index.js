import fetchApplication from "./fetch";
import parseApplication from "./parsing";

/**
 * @export
 * @param {import("@xxorg/google-play-scraping").ApplicationRequest} options
 * @returns {Promise<import("@xxorg/google-play-scraping").Application>}
 */
export default async function application(options) {
	const html = await fetchApplication(options);

	return parseApplication(html, options);
}
