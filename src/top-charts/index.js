import fetchTopCharts from "./fetch";
import parseApplicationList from "common/parsing/parse-list";
import debug from "util/debug";

export const TIME_BETWEEN_PAGES = 1000;

/**
 * @export
 * @param {import("google-play-scraping").TopChartsRequest} options
 * @returns {Promise<import("google-play-scraping").TopCharts>}
 */
export default async function topCharts(options) {
	debug("TOP CHARTS %o", options);

	const num = 120;
	const output = [];

	let start = 0;
	let extractedApplications = [];
	do {
		try {
			const html = await fetchTopCharts({ ...options, start, num });
			start += num;

			extractedApplications = parseApplicationList(html);
			output.push(...extractedApplications);
		} catch (err) {
			if (output.length) {
				debug(err);
				break;
			}
			throw err;
		}
	} while (extractedApplications.length && start < 500);

	return output;
}