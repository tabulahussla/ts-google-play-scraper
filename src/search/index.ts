import { ok } from "assert";
import { extract } from "~/common/parsing/parse-list";
import { ListApplication } from "~/typedef/list-application";
import { SearchRequest } from "~/typedef/search";
import debug from "~/util/debug";
import initialRequest, {
	extractSessionId,
	extractToken,
	nextPageRequest,
} from "./fetch";

export default async function search(
	options: SearchRequest
): Promise<ListApplication[]> {
	const output: ListApplication[] = [];
	const [initial, html] = await initialRequest(options);

	output.push(...extract(INITIAL_MAPPINGS.apps, initial));
	debug(
		"initial request parseApplicationList %d applications",
		output.length
	);

	const sessionId = extractSessionId(html);
	let token = extractToken(INITIAL_MAPPINGS.token, initial);

	ok(sessionId, "cannot extract session id from initial request");
	ok(token, "cannot extract token from initial request");

	debug("token %s", token);

	const requestId = getRequestId();
	let requestNumber = 0;
	while (token) {
		try {
			const data = await nextPageRequest({
				...options,
				token,
				sessionId,
				requestId,
				requestNumber,
			});

			output.push(...extract(REQUEST_MAPPINGS.apps, data));

			token = extractToken(REQUEST_MAPPINGS.token, data);
			requestNumber++;
		} catch (err) {
			if (output.length) {
				debug(err);
				break;
			}
			throw err;
		}
	}

	debug("fetch %d applications", output.length);

	return removeDuplicates(output);
}

export const INITIAL_MAPPINGS = {
	apps: ["ds:3", 0, 1, 0, 0, 0],
	token: ["ds:3", 0, 1, 0, 0, 7, 1],
};

export const REQUEST_MAPPINGS = {
	apps: [0, 0, 0],
	token: [0, 0, 7, 1],
};

export function getRequestId() {
	const PERIODIC = 99999;
	const MS_IN_S = 1000;
	const now = Math.floor(Date.now() / MS_IN_S);
	const offset = Math.floor(now / PERIODIC) * PERIODIC;
	const requestId = now - offset;

	return requestId.toString();
}

export function removeDuplicates(result: ListApplication[]) {
	/*
	TODO: improve search algorithm so results contain 100% unique results all the time.
	it has everyting to do with session identifiers in request parameters
	becasue normal web search returns 250 unique items all the time.
	at times we have 230-240 out of 250 unique ids.
	all ids have to be unique for correct functionality of the services.
	so i decide to cut repeated items out
	*/
	const unique = new Set();
	return result.reduce((output: ListApplication[], application) => {
		const { storeId } = application;
		if (!unique.has(storeId)) {
			output.push(application);
			unique.add(storeId);
		}
		return output;
	}, []);
}
