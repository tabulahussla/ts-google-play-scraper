import { extractMappedApplication } from "./extract-fields";
import { parse } from "../../util/script-data";

/**
 * @export
 * @param {string} html
 * @param {import("@xxorg/google-play-scraping").ApplicationRequest} request
 */
export default function parseApplication(html, request) {
	const scriptData = parse(html);
	const applicationData = extractMappedApplication(scriptData, request);

	return applicationData;
}
