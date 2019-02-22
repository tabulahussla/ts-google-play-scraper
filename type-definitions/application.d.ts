declare module "@xxorg/google-play-scraping" {
	export function application(options: ApplicationRequest): Promise<Application>;

	export type Histogram = {
		[key: number]: {
			[key: number]: number;
		};
	};
	export interface ApplicationRequest extends CommonRequest {
		storeId: string;
		languageCode?: string;
		countryCode?: string;
	}
	export interface Application {
		storeId: string;

		title: string;
		description: string;
		descriptionHTML: string;
		summary: string;
		formattedInstalls: string;
		minInstalls: number;
		score: number;
		formattedScore: string;
		ratings: number;
		reviews: number;
		histogram: Histogram;
		languages: string[];

		numericPrice: number;
		isFree: boolean;
		currency: string;
		formattedPrice: string;
		offersIAP: boolean;

		bundleSize: string;
		requiredOSVersion: string;

		developerName: string;
		developerId: string;
		developerEmail: string;
		developerWebsite: string;
		developerAddress: string;
		privacyPolicy: string;
		primaryCategory: string;
		primaryCategoryId: string;
		familyCategory: string;
		familyCategoryId: string;

		icon: string;
		headerImage: string;
		screenshots: string[];
		video: string;
		videoImage: string;

		contentRating: string;
		contentRatingDescription: string;
		adSupported: boolean;

		released: Date;
		updated: Date;

		version: string;
		changelog: string;
	}
}
