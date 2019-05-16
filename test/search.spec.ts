import "mocha";
import { search } from "../src";
import debug from "~/util/debug";
import { assertValidListApplication } from "./top-charts.spec";

describe("Search", () => {
	it("should retreive search with valid params", async function() {
		this.timeout(10000);

		const result = await search({
			term: "test",
			languageCode: "ru",
			countryCode: "RU",
		});

		debug("fetch %d applications", result.length);

		result.forEach(assertValidListApplication);
	});
});
