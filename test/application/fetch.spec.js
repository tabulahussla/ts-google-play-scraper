import "mocha";
import assert from "assert";
import fetchApplication from "application/fetch";

const APPLICATION_PAGE_REGEXP = /<title id="main-title">.*? - Apps on Google Play<\/title>/;

describe("Application", () => {
	it("should fetch application page with correct params", async function() {
		this.timeout(10000);

		const html = await fetchApplication({
			storeId: "com.facebook.katana",
			languageCode: "en-US",
			countryCode: "US",
		});

		assertValidPageHTML(html);
	});
	it("should throw 404 error if invalid params", async () => {
		await assert.rejects(() =>
			fetchApplication({
				storeId: "invalid-bundle",
				languageCode: "en-US",
				countryCode: "US",
			}),
		);
	});
});

function assertValidPageHTML(html) {
	assert.ok(typeof html === "string");
	assert.ok(APPLICATION_PAGE_REGEXP.test(html));
}
