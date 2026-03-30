const fs = require("node:fs");
const { INSTALL_FILE_NAME } = require("../constants");
const Log = require("../log");

module.exports = function init() {
  if (fs.existsSync(INSTALL_FILE_NAME)) {
    const message = "Install configuration already exists.";
    Log.warning(message);
    return { success: false, message };
  }

  fs.writeFileSync(INSTALL_FILE_NAME, JSON.stringify([], null, 2), "utf-8");
  const message = "Install configuration created.";
  Log.success(message);
  return { success: true, message };
};