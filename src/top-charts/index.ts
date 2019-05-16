import { parseApplicationList } from "~/common/parsing/parse-list";
import { ListApplication } from "~/typedef/list-application";
import { TopChartsRequest } from "~/typedef/top-charts";
import debug from "~/util/debug";
import fetchTopCharts from "./fetch";

export default async function topCharts(options: TopChartsRequest) {
	debug("TOP CHARTS %o", options);

	const num = 120;
	const output: ListApplication[] = [];

	let start = 0;
	let extractedApplications: ListApplication[] = [];
	do {
		try {
			const html = await fetchTopCharts({ ...options, start, num });
			start += num;

			extractedApplications = parseApplicationList(html);
			output.push(...extractedApplications);
		} catch (err) {
			if (output.length) {
				debug(err);
				break;
			}
			throw err;
		}
	} while (extractedApplications.length && start < 500);

	return output;
}
