import "mocha";
import { search } from "../src";
import debug from "~/util/debug";
import { assertValidListApplication } from "./top-charts.spec";
import { ok, strictEqual } from "assert";

describe("Search", () => {
	it("should retreive search with valid params", async function() {
		this.timeout(20000);

		const result = await search({
			term: "test",
			languageCode: "ru",
			countryCode: "RU",
		});

		result.forEach(assertValidListApplication);

		const noc = (value, array) =>
			array.reduce((a, v) => (v === value ? a + 1 : a), 0);
		const appIds = result.map(app => app.storeId);
		const uniqueAppIds = [...new Set(appIds)];
		const repeatedAppIds = uniqueAppIds.filter(
			appId => noc(appId, appIds) >= 2
		);

		// console.table(result.map(({ storeId, title }) => ({ storeId, title })));

		// console.log("non-unique ids: %s", repeatedAppIds);

		debug(
			"%d applications, %d unique applications",
			appIds.length,
			uniqueAppIds.length
		);

		ok(appIds.length >= 200);
		strictEqual(appIds.length, uniqueAppIds.length);
		ok(!repeatedAppIds.length);
	});
});
