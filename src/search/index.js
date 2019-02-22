import initialRequest, { extractClp, extractPageToken, nextPageRequest } from "./fetch";
import parseApplicationList from "common/parsing/parse-list";
import debug from "util/debug";

/**
 * @export
 * @param {import("google-play-scraping").SearchRequest} options
 * @returns {Promise<import("google-play-scraping").Search>}
 */
export default async function search(options) {
	const output = [];
	const initial = await initialRequest(options);

	output.push(...parseApplicationList(initial));

	let clp = extractClp(initial);
	let pageToken = extractPageToken(initial);

	let num = 48;
	let start = 0;

	while (pageToken) {
		try {
			const html = await nextPageRequest({ ...options, clp, pageToken, num, start });
			start += num;

			clp = clp || extractClp(html);
			pageToken = extractPageToken(html);

			output.push(...parseApplicationList(html));
		} catch (err) {
			if (output.length) {
				debug(err);
				break;
			}
			throw err;
		}
	}

	return output;
}
