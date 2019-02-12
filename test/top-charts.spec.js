import "mocha";
import assert from "assert";
import topCharts from "top-charts";
import Collection from "collection";
import { Category } from "../src";
import debug from "util/debug";

describe("Top Charts", () => {
	it("should retreive top charts with valid params", async function() {
		this.timeout(15000);

		const result = await topCharts({
			category: Category.FAMILY,
			collection: Collection.TOP_FREE,
			languageCode: "ru",
			countryCode: "RU",
		});

		debug("fetch %d applications", result.length);

		result.forEach(assertValidListApplication);
	});

	it("should retreive top charts with valid params with age", async function() {
		this.timeout(15000);

		const result = await topCharts({
			category: Category.FAMILY_MUSICVIDEO_9_AND_UP,
			collection: Collection.TOP_FREE,
			languageCode: "en-US",
			countryCode: "US",
		});

		debug("fetch %d applications", result.length);

		result.forEach(assertValidListApplication);
	});

	it("should fail with invalid params", async () => {
		await assert.rejects(() =>
			topCharts({
				category: "invalid",
				collection: Collection.TOP_FREE,
				languageCode: "en-AU",
				countryCode: "US",
			}),
		);
	});
});

export function assertValidListApplication(app) {
	assert.ok(app && typeof app === "object");
	assert.ok(typeof app.storeId === "string");
	assert.ok(typeof app.icon === "string");
	assert.ok(typeof app.title === "string");
	assert.ok(typeof app.summary === "string");
	assert.ok(typeof app.score === "number");
	assert.ok(typeof app.formattedScore === "string");
	assert.ok(typeof app.numericPrice === "number");
	assert.ok(typeof app.isFree === "boolean");
	assert.ok(typeof app.currency === "string");
	assert.ok(typeof app.formattedPrice === "string");
	assert.ok(typeof app.developerName === "string");
	assert.ok(typeof app.developerId === "string");
}
