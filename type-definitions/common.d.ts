import { AxiosRequestConfig } from "axios";

declare module "google-play-scraping" {
	export interface CommonRequest {
		options?: AxiosRequestConfig;
	}
}
