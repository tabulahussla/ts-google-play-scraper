import "mocha";
import path from "path";
import assert from "assert";
import { readFile } from "fs-extra";
import { parse } from "util/script-data";

describe("Application", () => {
	context("Parsing", () => {
		it("should be able to extract script data", async () => {
			const filePath = path.resolve(
				"fixtures/html/storefront-11.02.2019/application/com.facebook.katana.html",
			);
			const html = await readFile(filePath, "utf8");
			const scriptData = parse(html);

			assert.ok(scriptData);
		});
	});
});
