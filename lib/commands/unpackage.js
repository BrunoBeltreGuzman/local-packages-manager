const fs = require("node:fs");
const path = require("node:path");
const { getPackageDefinition } = require("../util/package-util");
const { DEFINITION_FILE_NAME } = require("../constants");
const { getLPMDir, dateDiff } = require("../util/common-util");
const Log = require("../log");

module.exports = function unpackage() {
  const pkg = getPackageDefinition(DEFINITION_FILE_NAME);
  const localPath = path.join(getLPMDir(), pkg.name, pkg.version);

  if (!fs.existsSync(localPath)) {
    throw new Error(`Package ${pkg.name}@${pkg.version} does not exist in local registry.`);
  }

  Log.info(`Unpacking ${pkg.name}@${pkg.version}...`);
  const startedAt = new Date();

  fs.rmSync(localPath, { recursive: true, force: true });

  const finishedAt = new Date();
  Log.success(`Unpacked ${pkg.name}@${pkg.version} in ${dateDiff(startedAt, finishedAt)}.`);

  return {
    name: pkg.name,
    version: pkg.version,
    path: localPath,
    unpackage: true,
  };
};

