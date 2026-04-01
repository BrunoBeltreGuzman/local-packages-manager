#!/usr/bin/env node

const { version } = require('../package.json');
const init = require("../lib/commands/init");
const createDefinition = require("../lib/commands/definition");
const pack = require("../lib/commands/package");
const unpackage = require("../lib/commands/unpackage");
const install = require("../lib/commands/install");
const uninstall = require("../lib/commands/uninstall");
const Log = require("../lib/log");

function printUsage() {
  Log.info("Usage: lpm <command> <option>");
  Log.info("Commands:");
  Log.info("init                            Create an install configuration file (package-install.json)");
  Log.info("new                             Create package-definition.json for current workspace");
  Log.info("package                         Pack the current package to ~/.lpm/<package>/<version> (short: p)");
  Log.info("unpackage                       Remove packed package from ~/.lpm/<package>/<version> (short: up)");
  Log.info("install <package@version>       Install all packages, or specific package by package and optional version (short: i)");
  Log.info("uninstall <package@version>     Remove a package from current workspace and install config by package and optional version (short: ui)");
  Log.info("help                            Display this help output (short: --help, -h)");
}

(async function main() {
  const [, , command, option] = process.argv;
  try {
    switch ((command || "").toLowerCase()) {
      case "init":
        init();
        break;
      case "new":
        createDefinition();
        break;
      case "package":
      case "p":
        pack();
        break;
      case "unpackage":
      case "up":
        unpackage();
        break;
      case "install":
      case "i":
        install(option);
        break;
      case "uninstall":
      case "ui":
        uninstall(option);
        break;
      case "help":
      case "--help":
      case "-h":
        printUsage();
        break;
      default:
        Log.info(`lpm version: ${version}`);
        if (command) {
          Log.error(`Unknown command: ${command}`);
          printUsage();
          process.exit(1);
        } else {
          printUsage();
        }
    }
  } catch (error) {
    Log.error(error.message || String(error));
    process.exit(1);
  }
})();