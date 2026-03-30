#!/usr/bin/env node

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
  Log.info("init                        Create an install configuration file (package-install.json)");
  Log.info("new                         Create package-definition.json for current workspace");
  Log.info("package                     Pack the current package to ~/.lpm/<name>/<version>");
  Log.info("unpackage                   Remove packed package from ~/.lpm/<name>/<version>");
  Log.info("install <name@version>      Install all packages, or specific package by name and optional version");
  Log.info("uninstall <name@version>    Remove a package from current workspace and install config by name and optional version");
  Log.info("help                        Display this help output");
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
        pack();
        break;
      case "unpackage":
        unpackage();
        break;
      case "install":
        install(option);
        break;
      case "uninstall":
        uninstall(option);
        break;
      case "help":
      case "--help":
      case "-h":
        printUsage();
        break;
      default:
        Log.info(`lpm version ${require("../package.json").version}`);
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