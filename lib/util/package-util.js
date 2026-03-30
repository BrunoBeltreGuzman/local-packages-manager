const fs = require("node:fs");
const { DEFINITION_FILE_NAME } = require("../constants");

function getLastVersion(packageDirPath) {
  if (!fs.existsSync(packageDirPath)) return null;

  const versions = fs.readdirSync(packageDirPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  if (versions.length === 0) return null;

  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
  return versions.sort(collator.compare).at(-1);
}

function getPackageDefinition(filePath = DEFINITION_FILE_NAME) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing definition file: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

module.exports = {
  getLastVersion,
  getPackageDefinition,
};