declare module "google-play-scraping" {
	export interface TopChartsRequest extends CommonRequest {
		category: string;
		collection: string;
		languageCode?: string;
		countryCode?: string;
	}
	export interface TopChartsInternalRequest extends CommonRequest {
		category: string;
		collection: string;
		languageCode?: string;
		countryCode?: string;
		start: number;
		num: number;
	}
	export type TopCharts = ListApplication[];

	export function topCharts(options: TopChartsRequest): Promise<TopCharts>;
}
