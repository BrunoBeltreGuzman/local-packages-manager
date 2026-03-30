const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

function decodePackage(packageName) {
  if (!packageName) return { name: null, version: null };
  const [name, version] = packageName.split("@");
  return { name: name || null, version: version || null };
}

function ensureDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDirectory(dest);

  for (const entry of fs.readdirSync(src)) {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      ensureDirectory(path.dirname(destPath));
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function readJsonFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

function writeJsonFile(filePath, data) {
  ensureDirectory(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function getLPMDir() {
  return path.join(os.homedir(), ".lpm");
}

function dateDiff(startTime, endTime) {
  return `${endTime - startTime}ms`;
}

module.exports = {
  decodePackage,
  ensureDirectory,
  copyDir,
  readJsonFile,
  writeJsonFile,
  getLPMDir,
  dateDiff,
};