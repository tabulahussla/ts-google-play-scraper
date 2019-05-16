import { ApplicationRequest } from "~/typedef/application";
import { parse } from "~/util/script-data";
import { extractMappedApplication } from "./extract-fields";

export default function parseApplication(
	html: string,
	request: ApplicationRequest
) {
	const scriptData = parse(html);
	const applicationData = extractMappedApplication(scriptData, request);

	return applicationData;
}
