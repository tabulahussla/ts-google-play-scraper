import { ApplicationRequest } from "~/typedef/application";
import fetchApplication from "./fetch";
import parseApplication from "./parsing";

export default async function application(options: ApplicationRequest) {
	const html = await fetchApplication(options);

	return parseApplication(html, options);
}
