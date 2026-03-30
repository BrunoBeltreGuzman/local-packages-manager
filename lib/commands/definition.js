const fs = require("node:fs");
const path = require("node:path");
const { DEFINITION_FILE_NAME, DEFAULT_SOURCE_PATH } = require("../constants");
const Log = require("../log");

module.exports = function createDefinition() {
  const currentDir = process.cwd();
  const packageName = path.basename(currentDir);
  const packageVersion = "1.0.0";
  const definitionFilePath = path.join(currentDir, DEFINITION_FILE_NAME);

  if (fs.existsSync(definitionFilePath)) {
    throw new Error(`Definition file already exists`);
  }

  const payload = {
    name: packageName,
    version: packageVersion,
    sourcePath: DEFAULT_SOURCE_PATH,
    include: ["/**"],
    exclude: [],
  };

  fs.writeFileSync(definitionFilePath, JSON.stringify(payload, null, 2), "utf-8");
  Log.success(`Definition created`);

  return payload;
};

