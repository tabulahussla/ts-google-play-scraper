import parseObfuscatedApplicationList from "~/common/parsing/parse-obfuscated-list";
import debug from "~/util/debug";
import {
	extractPageToken,
	initialRequest,
	nextPageRequest,
} from "./fetch/applications";
import { fetchPublisherInfo } from "./fetch/publisher";
import parsePublisher from "./parsing";

export const NUMERIC_ID_REGEXP = /^\d+$/;

/**
 * @export
 * @param {import("@xxorg/google-play-scraping").PublisherRequest} options
 * @returns {Promise<import("@xxorg/google-play-scraping").Publisher>}
 */
export default async function publisher(options) {
	debug("PUBLISHER %o", options);

	let { storeId } = options;
	/** @type {import("@xxorg/google-play-scraping").Publisher} */
	// @ts-ignore
	let publisherInfo = {
		name: storeId,
	};
	if (NUMERIC_ID_REGEXP.test(storeId)) {
		const html = await fetchPublisherInfo(options);
		publisherInfo = parsePublisher(html);
		storeId = publisherInfo.name;
	}

	const applications = [];
	const initial = await initialRequest({ ...options, storeId });

	applications.push(...parseObfuscatedApplicationList(initial));

	let pageToken = extractPageToken(initial);

	const num = 120;
	let start = 0;

	while (pageToken) {
		try {
			const html = await nextPageRequest({
				...options,
				pageToken,
				num,
				start,
			});
			start += num;

			pageToken = extractPageToken(html);

			applications.push(...parseObfuscatedApplicationList(html));
		} catch (err) {
			if (applications.length) {
				debug(err);
				break;
			}
			throw err;
		}
	}

	return {
		...publisherInfo,
		applications,
	};
}
