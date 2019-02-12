import "mocha";
import assert from "assert";
import application from "application";
import languageCodes from "fixtures/language-codes.json";
import moment from "moment";
import debug from "util/debug";

describe("Application", () => {
	it("should retreive application with valid params", async () => {
		const app = await application({
			storeId: "com.astragon.cs2016",
			languageCode: "en-AU",
			countryCode: "US",
		});

		assertValidApplication(app);
	});

	// TODO: fix release date parsing on every locale
	it.skip("should retreive application with valid params on every language code", async function() {
		this.timeout(languageCodes.length * 5000);

		const validReleaseTimestamp = +moment.utc("Mar 22, 2017", "LL").toDate();

		for (const languageCode of languageCodes) {
			try {
				const app = await application({
					storeId: "com.astragon.cs2016",
					languageCode,
					countryCode: "US",
				});

				assertValidApplication(app);

				assert.strictEqual(+app.released, validReleaseTimestamp);
			} catch (err) {
				debug("Locale %s invalid", languageCode, err);
			}
		}
	});

	it("should fail with invalid params", async () => {
		await assert.rejects(() =>
			application({
				storeId: "invalid-bundle",
				languageCode: "en-US",
				countryCode: "US",
			}),
		);
	});
});

function assertValidApplication(app) {
	assert.ok(app && typeof app === "object");
	assert.ok(typeof app.storeId === "string");
	assert.ok(typeof app.title === "string");
	assert.ok(typeof app.description === "string");
	assert.ok(typeof app.descriptionHTML === "string");
	assert.ok(typeof app.summary === "string");
	assert.ok(typeof app.formattedInstalls === "string");
	assert.ok(typeof app.minInstalls === "number");
	assert.ok(typeof app.score === "number");
	assert.ok(typeof app.formattedScore === "string");
	assert.ok(typeof app.ratings === "number");
	assert.ok(typeof app.reviews === "number");
	assert.ok(typeof app.histogram === "object");
	assert.ok(typeof app.numericPrice === "number");
	assert.ok(typeof app.isFree === "boolean");
	assert.ok(typeof app.currency === "string");
	assert.ok(typeof app.formattedPrice === "string");
	assert.ok(typeof app.offersIAP === "boolean");
	assert.ok(typeof app.bundleSize === "string");
	assert.ok(typeof app.requiredOSVersion === "string");
	assert.ok(typeof app.developerName === "string");
	assert.ok(typeof app.developerId === "string");
	assert.ok(typeof app.developerEmail === "string");
	assert.ok(typeof app.developerWebsite === "string");
	assert.ok(typeof app.developerAddress === "string");
	assert.ok(typeof app.privacyPolicy === "string");
	assert.ok(typeof app.primaryCategory === "string");
	assert.ok(typeof app.primaryCategoryId === "string");
	assert.ok(!app.familyCategory || typeof app.familyCategory === "string");
	assert.ok(!app.familyCategoryId || typeof app.familyCategoryId === "string");
	assert.ok(typeof app.icon === "string");
	assert.ok(typeof app.headerImage === "string");
	assert.ok(Array.isArray(app.screenshots));
	assert.ok(!app.video || typeof app.video === "string");
	assert.ok(!app.videoImage || typeof app.videoImage === "string");
	assert.ok(typeof app.contentRating === "string");
	assert.ok(!app.contentRatingDescription || typeof app.contentRatingDescription === "string");
	assert.ok(typeof app.adSupported === "boolean");
	assert.ok(
		!app.released || (app.released instanceof Date && app.released.toString() !== "Invalid Date"),
		"invalid release date",
	);
	assert.ok(app.updated instanceof Date);
	assert.ok(typeof app.version === "string");
	assert.ok(typeof app.changelog === "string");
}
