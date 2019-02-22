declare module "google-play-scraping" {
	export function publisher(options: PublisherRequest): Promise<Publisher>;

	export interface PublisherRequest extends CommonRequest {
		storeId: string;
		languageCode?: string;
		countryCode?: string;
	}
	export interface Publisher {
		name: string;
		description: string;
		icon: string;
		headerImage: string;
		website?: string;
		featured?: ListApplication;
		applications?: ListApplication[];
	}
}
