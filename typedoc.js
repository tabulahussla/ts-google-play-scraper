module.exports = {
	out: "./public/doc",

	readme: "none",
	includes: "./src",
	exclude: ["**/node_modules/**/*", "src/common", "test/**/*"],

	mode: "file",
	includeDeclarations: true,
	excludeExternals: true,
	excludeNotExported: true,
	excludePrivate: true,
	excludeProtected: true,
};
