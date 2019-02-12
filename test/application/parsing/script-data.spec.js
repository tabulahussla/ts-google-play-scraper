import "mocha";
import path from "path";
import assert from "assert";
import { readFile } from "fs-extra";
import { extractScriptData } from "application/parsing/script-data";

describe("Application", () => {
	describe("Parsing", () => {
		it("should be able to extract script data", async () => {
			const filePath = path.resolve(
				"fixtures/html/storefront-11.02.2019/application/com.facebook.katana.html",
			);
			const html = await readFile(filePath, "utf8");
			const scriptData = extractScriptData(html);

			assert.ok(scriptData);
		});
	});
});
