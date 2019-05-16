import { stringify } from "querystring";

export function raw(value: string) {
	return value;
}

export default function rawStringify(obj) {
	return stringify(obj, void 0, void 0, { encodeURIComponent: raw });
}
