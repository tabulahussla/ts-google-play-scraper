import "mocha";
import assert from "assert";
import { publisher } from "../src";
import debug from "util/debug";
import { assertValidListApplication } from "./top-charts.spec";

describe.skip("Publisher", () => {
	it("should retreive publisher with valid params", async function() {
		this.timeout(10000);

		const result = await publisher({
			storeId: "4612309125060036115",
			languageCode: "ru",
			countryCode: "RU",
		});

		debug("fetch %d applications", result.applications.length);

		assert.strictEqual(result.name, "Abuzz");
		assert.ok(result.applications.length);
		result.applications.forEach(assertValidListApplication);
	});
});
