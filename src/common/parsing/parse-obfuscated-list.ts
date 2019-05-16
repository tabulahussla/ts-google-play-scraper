import cheerio from "cheerio";
import { STORE_ID_REGEXP } from "~/application/parsing/extract-fields";
import { ListApplication } from "~/typedef/list-application";

export const APPLICATION_SELECTOR =
	"c-wiz > div[jslog*=\"track:click,impression\"]";
export const NUMERIC_PRICE_REGEXP = /([\d]+[.,]?[\d]+)/;
export const CURRENCY_REGEXP = /((?:(?!\.))[\D]+)/;

export default function parseObfuscatedApplicationList(
	html
): ListApplication[] {
	const $ = cheerio.load(html);

	return $(APPLICATION_SELECTOR)
		.get()
		.map(app => parseObfuscatedApp($(app)));
}

export function parseObfuscatedApp($app): ListApplication {
	const formattedPrice = $app
		.find("button > div > span > span")
		.first()
		.text();

	// if price string contains numbers, it's not free
	const isFree = !/\d/.test(formattedPrice);

	let numericPrice = 0;
	let currency = "";

	if (!isFree) {
		// @ts-ignore
		const [, label = "0"] =
			formattedPrice.match(NUMERIC_PRICE_REGEXP) || [];
		numericPrice = +label;
		[, currency = ""] = formattedPrice.match(CURRENCY_REGEXP) || [];
		currency = currency.trim();
	}

	const formattedScore =
		$app.find("div[aria-label*=\"star\"]").attr("aria-label") || "";
	let score = NaN;
	if (formattedScore) {
		score = parseFloat(formattedScore.match(/[\d.]+/)[0]);
	}
	const storeUrl = $app
		.find("a[href*=\"/store/apps/details?id=\"]")
		.first()
		.attr("href");
	const [, storeId = void 0] = storeUrl.match(STORE_ID_REGEXP) || [];

	return {
		storeId,
		title: $app
			.find("a[href*=\"/store/apps/details?id=\"] > div")
			.first()
			.text(),
		developerName: $app
			.find("a[href*=\"store/apps/dev\"] > div")
			.first()
			.text(),
		developerId:
			$app
				.find("a[href*=\"store/apps/dev\"]")
				.first()
				.attr("href")
				.split("id=")[1] || "",
		icon:
			$app
				.find("img[data-ils=\"3\"]")
				.first()
				.attr("src") || "",
		score,
		formattedScore,
		formattedPrice,
		currency,
		numericPrice,
		isFree,
	};
}
