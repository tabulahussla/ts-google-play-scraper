import { stringify } from "querystring";

export function raw(string) {
	return string;
}

export default function rawStringify(obj) {
	return stringify(obj, void 0, void 0, { encodeURIComponent: raw });
}
