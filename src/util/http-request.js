import Axios from "axios";
import userAgent from "userAgent";
import throttle from "throat";

export function httpRequestImpl(options) {
	return Axios({
		responseType: "text",
		...options,
		headers: { ...(options.headers || {}), "User-Agent": userAgent },
	});
}

/**
 * @type {(req:import("axios").AxiosRequestConfig)=>Promise<import("axios").AxiosResponse>}
 */
let httpRequest = httpRequestImpl;
if (process.env.NODE_ENV === "test") {
	httpRequest = throttle(1, httpRequestImpl);
}

export default httpRequest;
