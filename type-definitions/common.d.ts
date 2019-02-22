import { AxiosRequestConfig } from "axios";

declare module "@xxorg/google-play-scraping" {
	export interface CommonRequest {
		options?: AxiosRequestConfig;
	}
}
