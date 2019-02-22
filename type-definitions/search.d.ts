declare module "@xxorg/google-play-scraping" {
	export function search(options: SearchRequest): Promise<Search>;

	export enum Pricing {
		free = 1,
		paid = 2,
		all = 0,
	}

	export interface SearchRequest extends CommonRequest {
		term: string;
		pricing?: Pricing;
		languageCode?: string;
		countryCode?: string;
	}
	export type Search = ListApplication[];
}
