import cheerio from "cheerio";

/**
 * @export
 * @param {string} html
 * @returns {import("@xxorg/google-play-scraping").Publisher}
 */
export default function parsePublisher(html) {
	const $ = cheerio.load(html);

	return {
		name: $('[itemprop="name"]').text(),
		description: $('[itemprop="description"]').text(),
		icon: $('[srcset*="2x"]')
			.slice(1)
			.first()
			.attr("src"),
		headerImage: $('[srcset*="2x"]')
			.first()
			.attr("src"),
		website: $('a:contains("Visit website")')
			.first()
			.attr("href"),
	};
}
