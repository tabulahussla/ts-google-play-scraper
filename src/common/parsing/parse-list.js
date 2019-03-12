import cheerio from "cheerio";

export const NUMERIC_REGEXP = /\d/;
export const NUMERIC_PRICE_REGEXP = /([\d]+[.,]?[\d]+)/;
export const CURRENCY_REGEXP = /((?:(?!\.))[\D]+)/;

/**
 * @export
 * @param {string} html
 * @returns {import("@xxorg/google-play-scraping").ListApplication[]}
 */
export default function parseApplicationList(html) {
	const $ = cheerio.load(html);

	return $(".card")
		.get()
		.map(app => parseApp($(app)));
}

/**
 * @export
 * @param {Cheerio} $app
 * @returns {import("@xxorg/google-play-scraping").ListApplication}
 */
export function parseApp($app) {
	let formattedPrice = $app
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
		const [, label = "0"] = formattedPrice.match(NUMERIC_PRICE_REGEXP) || [];
		numericPrice = +label;
		[, currency = ""] = formattedPrice.match(CURRENCY_REGEXP) || [];
		currency = currency.trim();
	}

	const formattedScore = $app.find("div.tiny-star").attr("aria-label") || "";
	let score = NaN;
	if (formattedScore) {
		score = parseFloat(formattedScore.match(/[\d.]+/)[0]);
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
