declare module "google-play-scraping" {
	export interface ListApplication {
		storeId: string;

		icon: string;
		title: string;
		summary: string;
		score: number;
		formattedScore: string;

		developerName: string;
		developerId: string;

		numericPrice: number;
		isFree: boolean;
		currency: string;
		formattedPrice: string;
	}
}
