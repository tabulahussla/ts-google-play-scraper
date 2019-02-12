import fetchSearch, { getClp, getNextToken, fetchResults } from "./fetch";
import parseApplicationList from "common/parsing/parse-list";
import debug from "util/debug";

/**
 * @export
 * @param {import("google-play-scraping").SearchRequest} options
 * @returns {Promise<import("google-play-scraping").Search>}
 */
export default async function search(options) {
	const output = [];
	const initial = await fetchSearch(options);

	output.push(...parseApplicationList(initial));

	let clp = getClp(initial);
	let nextToken = getNextToken(initial);

	let num = 48;
	let start = 0;

	do {
		try {
			const html = await fetchResults({ ...options, clp, nextToken, num, start });
			start += num;

			clp = clp || getClp(html);
			nextToken = getNextToken(html);

			output.push(...parseApplicationList(html));
		} catch (err) {
			if (output.length) {
				debug(err);
				break;
			}
			throw err;
		}
	} while (nextToken);

	return output;
}
