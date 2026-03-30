const fs = require("node:fs");
const path = require("node:path");
const { INSTALL_FILE_NAME, DEFAULT_INSTALL_PATH } = require("../constants");
const { getLPMDir, readJsonFile, writeJsonFile } = require("../util/common-util");
const { getLastVersion } = require("../util/package-util");
const Log = require("../log");

module.exports = function addPackage(name, version = null) {
  if (!name || typeof name !== "string") {
    throw new Error("A valid package name is required.");
  }

  const packageFolder = path.join(getLPMDir(), name);

  if (!fs.existsSync(packageFolder)) {
    throw new Error(`Package does not exist in local registry: ${name}`);
  }

  let packageVersion = version;

  if (packageVersion) {
    const versionFolder = path.join(packageFolder, packageVersion);
    if (!fs.existsSync(versionFolder)) {
      throw new Error(`Package version not found: ${name}@${packageVersion}`);
    }
  } else {
    packageVersion = getLastVersion(packageFolder);
    if (!packageVersion) {
      throw new Error(`No versions found for package ${name}`);
    }
  }

  const packages = readJsonFile(INSTALL_FILE_NAME) || [];

  const packageEntry = packages.find(pkg => pkg.name === name);
  const versionEntry = packages.find(pkg => pkg.name === name && pkg.version === packageVersion);

  if (versionEntry) {
    Log.info(`Package ${name}@${packageVersion} is already installed in install list.`);
    return { name, version: packageVersion, updated: false };
  }

  if (packageEntry) {
    packageEntry.version = packageVersion;
    writeJsonFile(INSTALL_FILE_NAME, packages);
    Log.success(`Package ${name}@${packageVersion} has been updated in install configuration.`);
    return { name, version: packageVersion, updated: true };
  }

  const newEntry = {
    name,
    version: packageVersion,
    installPath: DEFAULT_INSTALL_PATH,
  };

  packages.push(newEntry);
  writeJsonFile(INSTALL_FILE_NAME, packages);

  Log.success(`Package ${name}@${packageVersion} has been added to install configuration.`);
  return { name, version: packageVersion, added: true };
};

