import initialRequest, { extractToken, nextPageRequest } from "./fetch";
import { extract } from "common/parsing/parse-list";
import debug from "util/debug";

/**
 * @export
 * @param {import("@xxorg/google-play-scraping").SearchRequest} options
 * @returns {Promise<import("@xxorg/google-play-scraping").Search>}
 */
export default async function search(options) {
	const output = [];
	const initial = await initialRequest(options);

	output.push(...extract(INITIAL_MAPPINGS.apps, initial));
	debug("initial request parseApplicationList %d applications", output.length);

	let token = extractToken(INITIAL_MAPPINGS.token, initial);

	debug("token %s", token);

	while (token) {
		try {
			const data = await nextPageRequest({ ...options, token });

			output.push(...extract(REQUEST_MAPPINGS.apps, data));

			token = extractToken(REQUEST_MAPPINGS.token, data);
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

export const INITIAL_MAPPINGS = {
	apps: ["ds:3", 0, 1, 0, 0, 0],
	token: ["ds:3", 0, 1, 0, 0, 7, 1],
};

export const REQUEST_MAPPINGS = {
	apps: [0, 0, 0],
	token: [0, 0, 7, 1],
};
