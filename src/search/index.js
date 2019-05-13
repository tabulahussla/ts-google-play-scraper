import initialRequest, { extractClp, extractPageToken, nextPageRequest } from "./fetch";
import parseApplicationList from "common/parsing/parse-list";
import debug from "util/debug";

/**
 * @export
 * @param {import("@xxorg/google-play-scraping").SearchRequest} options
 * @returns {Promise<import("@xxorg/google-play-scraping").Search>}
 */
export default async function search(options) {
	const output = [];
	const initial = await initialRequest(options);

	output.push(...parseApplicationList(initial));
	debug("initial request parseApplicationList %d applications", output.length);

	let clp = extractClp(initial);
	let pageToken = extractPageToken(initial);

	debug("clp %s, pageTok %s", clp, pageToken);

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
