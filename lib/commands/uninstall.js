const fs = require("node:fs");
const path = require("node:path");
const Log = require("../log");
const { dateDiff, decodePackage, readJsonFile, writeJsonFile } = require("../util/common-util");
const { INSTALL_FILE_NAME } = require("../constants");

module.exports = function uninstall(packageName) {
  if (!fs.existsSync(INSTALL_FILE_NAME)) {
    throw new Error("Missing install configuration. Run 'lpm init' first.");
  }

  const { name, version } = decodePackage(packageName);
  if (!name) {
    throw new Error("Package name is required for uninstall.");
  }

  const packages = readJsonFile(INSTALL_FILE_NAME) || [];
  const packageEntry = packages.find(pkg => pkg.name === name);

  if (!packageEntry) {
    throw new Error(`Package ${name} is not installed.`);
  }

  if (version && packageEntry.version !== version) {
    throw new Error(`Package ${name}@${version} is not installed (installed version: ${packageEntry.version}).`);
  }

  const targetPath = path.join(process.cwd(), packageEntry.installPath);

  if (!fs.existsSync(targetPath)) {
    throw new Error(`Package path does not exist: ${targetPath}`);
  }

  Log.info(`Uninstalling ${name}@${packageEntry.version}...`);
  const startedAt = new Date();

  const updatedPackages = packages.filter(pkg => !(pkg.name === name && pkg.version === packageEntry.version));
  writeJsonFile(INSTALL_FILE_NAME, updatedPackages);
  fs.rmSync(targetPath, { recursive: true, force: true });

  const endedAt = new Date();
  Log.success(`Uninstalled ${name}@${packageEntry.version} in ${dateDiff(startedAt, endedAt)}.`);

  return {
    name,
    version: packageEntry.version,
    uninstalled: true,
  };
};