const fs = require("node:fs");
const path = require("node:path");
const { INSTALL_FILE_NAME } = require("../constants");
const { decodePackage, getLPMDir, copyDir, readJsonFile, dateDiff } = require("../util/common-util");
const addPackage = require("./add");
const Log = require("../log");

module.exports = function install(packageName = null) {
  if (!fs.existsSync(INSTALL_FILE_NAME)) {
    throw new Error("Missing install configuration. Run 'lpm init' first.");
  }

  const { name, version } = decodePackage(packageName);
  let packages = readJsonFile(INSTALL_FILE_NAME) || [];

  if (name && !packages.some(pkg => pkg.name === name)) {
    addPackage(name, version);
    packages = readJsonFile(INSTALL_FILE_NAME) || [];
  }

  const now = new Date();
  let installedCount = 0;
  let notPackagedCount = 0;

  for (const pkg of packages) {
    if (name && pkg.name !== name) continue;

    if (version && pkg.name === name && pkg.version !== version) {
      Log.info(`Updating package ${pkg.name} from ${pkg.version} to ${version}`);
      addPackage(name, version);
      pkg.version = version;
    }

    const srcPath = path.join(getLPMDir(), pkg.name, pkg.version);
    const targetPath = path.join(process.cwd(), pkg.installPath);

    if (!fs.existsSync(srcPath)) {
      Log.warning(`Package ${pkg.name}@${pkg.version} is not packaged in local registry.`);
      notPackagedCount++;
      continue;
    }

    Log.info(`Installing ${pkg.name}@${pkg.version}...`);
    const packageStart = new Date();
    copyDir(srcPath, targetPath);
    const packageEnd = new Date();
    installedCount++;
    Log.success(`Installed ${pkg.name}@${pkg.version} in ${dateDiff(packageStart, packageEnd)}.`);
  }

  const finishedAt = new Date();
  Log.info(`Installed ${installedCount} package(s) in ${dateDiff(now, finishedAt)}.`);

  if (notPackagedCount > 0) {
    Log.warning(`${notPackagedCount} package(s) were not packaged and could not be installed.`);
    Log.warning(`Run 'lpm package' before 'lpm install' for those packages.`);
  }

  return {
    installedCount,
    notPackagedCount,
  };
};