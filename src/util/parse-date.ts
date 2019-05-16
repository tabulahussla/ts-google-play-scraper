import moment from "moment";
import FORMAT_BY_LOCALE from "~/fixtures/date-format-by-language.json";

export default function parseDate(label, locale) {
	label = label.replace(/\u200F/g, "");

	const date = moment.utc(label, FORMAT_BY_LOCALE[locale], locale).toDate();

	return date;
}
