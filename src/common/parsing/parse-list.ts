import cheerio from "cheerio";
import R from "ramda";
import url from "url";
import { ListApplication } from "~/typedef/list-application";
import { extractor } from "~/util/script-data";

export const NUMERIC_REGEXP = /\d/;
export const NUMERIC_PRICE_REGEXP = /([\d]+[.,]?[\d]+)/;
export const CURRENCY_REGEXP = /((?:(?!\.))[\D]+)/;
export const COMMA_REGEXP = /,/g;

export const MAPPINGS = {
	title: [2],
	storeId: [12, 0],
	url: {
		path: [9, 4, 2],
		fun: (path: string) =>
			new url.URL(path, "https://play.google.com").toString(),
	},
	icon: [1, 1, 0, 3, 2],
	developerName: [4, 0, 0, 0],
	developerId: {
		path: [4, 0, 0, 1, 4, 2],
		fun: extaractDeveloperId,
	},
	formattedPrice: {
		path: [7, 0, 3, 2, 1, 0, 2],
		fun: (price: string) => (price === undefined ? "FREE" : price),
	},
	numericPrice: {
		path: [7, 0, 3, 2, 1, 0, 2],
		fun: extractNumericPrice,
	},
	currency: {
		path: [7, 0, 3, 2, 1, 0, 2],
		fun: extractCurrency,
	},
	isFree: {
		path: [7, 0, 3, 2, 1, 0, 2],
		fun: (price: string) => price === undefined,
	},
	summary: [4, 1, 1, 1, 1],
	formattedScore: [6, 0, 2, 1, 0],
	score: [6, 0, 2, 1, 1],
};

export function extaractDeveloperId(path: string) {
	const q = new url.URL(path, "https://play.google.com");
	return q.searchParams.get("id");
}

export function extractNumericPrice(price: string) {
	if (typeof price === "string") {
		const [, label = "0"] = price.match(NUMERIC_PRICE_REGEXP) || [];
		return parseFloat(label.trim().replace(COMMA_REGEXP, "."));
	}

	return 0;
}

export function extractCurrency(price: string) {
	if (typeof price === "string") {
		const [, currency = ""] = price.match(CURRENCY_REGEXP) || [];
		return currency.trim();
	}

	return "";
}

/**
 * Apply MAPPINGS for each application in list from root path
 */
export function extract(root: any, data: any) {
	const input: any = R.path(root, data);
	return R.map(extractor(MAPPINGS), input);
}

export function parseApplicationList(html: string): ListApplication[] {
	const $ = cheerio.load(html);

	return $(".card")
		.get()
		.map(app => parseApp($(app)));
}

export function parseApp($app: Cheerio) {
	const formattedPrice = $app
		.find("span.display-price")
		.first()
		.text()
		.trim();

	// if price string contains numbers, it's not free
	const isFree = !NUMERIC_REGEXP.test(formattedPrice);

	let numericPrice = 0;
	let currency = "";

	if (!isFree) {
		// @ts-ignore
		const [, label = "0"] =
			formattedPrice.match(NUMERIC_PRICE_REGEXP) || [];
		numericPrice = parseFloat(label.trim().replace(COMMA_REGEXP, "."));
		[, currency = ""] = formattedPrice.match(CURRENCY_REGEXP) || [];
		currency = currency.trim();
	}

	const formattedScore: string =
		$app.find("div.tiny-star").attr("aria-label") || "";
	let score = NaN;
	if (formattedScore) {
		score = parseFloat((formattedScore.match(/[\d.]+/) || [])[0]);
	}

	return {
		storeId: $app.attr("data-docid"),
		title: $app.find("a.title").attr("title"),
		summary: $app
			.find("div.description")
			.text()
			.trim(),
		developerName: $app.find("a.subtitle").text(),
		developerId: $app
			.find("a.subtitle")
			.attr("href")
			.split("id=")[1],
		icon: $app.find("img.cover-image").attr("data-cover-large"),
		score,
		formattedScore,
		formattedPrice,
		currency,
		numericPrice,
		isFree,
	};
}
