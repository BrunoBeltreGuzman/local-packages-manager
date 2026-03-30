const fs = require("node:fs");
const path = require("node:path");
const Log = require("../log");
const { getPackageDefinition } = require("../util/package-util");
const { copyDir, dateDiff, getLPMDir } = require("../util/common-util");
const { DEFINITION_FILE_NAME } = require("../constants");

module.exports = function pack() {
  const pkg = getPackageDefinition(DEFINITION_FILE_NAME);

  const srcPath = path.join(process.cwd(), pkg.sourcePath || "src");
  const targetPath = path.join(getLPMDir(), pkg.name, pkg.version);

  if (!fs.existsSync(srcPath)) {
    throw new Error(`Source path not found: ${srcPath}`);
  } else if (fs.existsSync(targetPath)) {
      fs.rmSync(targetPath, { recursive: true, force: true });
  }

  Log.info(`Packing ${pkg.name}@${pkg.version}...`);
  const startedAt = new Date();

  copyDir(srcPath, targetPath);

  const finishedAt = new Date();
  Log.success(`Packed ${pkg.name}@${pkg.version} in ${dateDiff(startedAt, finishedAt)}.`);

  return {
    name: pkg.name,
    version: pkg.version,
    sourcePath: pkg.sourcePath,
    destination: targetPath,
  };
};
