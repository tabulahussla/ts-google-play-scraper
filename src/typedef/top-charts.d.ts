import { CommonRequest } from "./common";
import { ListApplication } from "./list-application";

export interface TopChartsRequest extends CommonRequest {
	category: string;
	collection: string;
	languageCode?: string;
	countryCode?: string;
}
export interface TopChartsInternalRequest extends TopChartsRequest {
	start: number;
	num: number;
}
export type TopCharts = ListApplication[];

export function topCharts(options: TopChartsRequest): Promise<TopCharts>;
