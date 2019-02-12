import Axios from "axios";
import userAgent from "userAgent";

/**
 *
 *
 * @export
 * @param {import("axios").AxiosRequestConfig} options
 * @returns
 */
export default function httpRequest(options) {
	return Axios({ ...options, headers: { ...(options.headers || {}), "User-Agent": userAgent } });
}
