import "mocha";
import path from "path";
import { readFile } from "fs-extra";
import { parse } from "util/script-data";
import { extractMappedApplication } from "application/parsing/extract-fields";
import { assertValidApplication } from "../../application.spec";

describe("Application", () => {
	context("Parsing", () => {
		it("should be able to map extracted data to a valid application", async () => {
			const filePath = path.resolve("fixtures/html/storefront-11.02.2019/application/com.facebook.katana.html");
			const html = await readFile(filePath, "utf8");
			const scriptData = parse(html);
			const application = extractMappedApplication(scriptData, { languageCode: "en-US" });

			assertValidApplication(application);
		});
	});
});
