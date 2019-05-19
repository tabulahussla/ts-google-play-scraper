import { Application, ApplicationRequest } from "~/typedef/application";
import { parse } from "~/util/script-data";
import { extractMappedApplication } from "./extract-fields";

export const AGE_REGEXP = /alt="Targeted for Age.*?>(.*?)</;

export default function parseApplication(
	html: string,
	request: ApplicationRequest
): Application {
	const scriptData = parse(html);
	const applicationData = extractMappedApplication(
		scriptData,
		request
	) as Application;
	const [, ageTargeting = ""] = html.match(AGE_REGEXP) || [];
	const categories = [
		applicationData.primaryCategoryId,
		applicationData.familyCategoryId,
	].filter(v => v);

	return { ...applicationData, ageTargeting, categories };
}
