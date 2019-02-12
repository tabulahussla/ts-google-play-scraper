import Axios from "axios";
import userAgent from "userAgent";
import throttle from "throat";

export function httpRequestImpl(options) {
	return Axios({ ...options, headers: { ...(options.headers || {}), "User-Agent": userAgent } });
}

let requestFunction = httpRequestImpl;
if (process.env.NODE_ENV === "test") {
	requestFunction = throttle(1, httpRequestImpl);
}

/**
 *
 *
 * @export
 * @param {import("axios").AxiosRequestConfig} options
 * @returns
 */
export default requestFunction;
