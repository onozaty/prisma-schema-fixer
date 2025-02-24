import { Command } from "commander";
import { version } from "../package.json";
import { fix } from "./fixer";

const program = new Command();
program
  .name("prisma-schema-fixer")
  .description("Fix schema.prisma according to the rules")
  .option(
    "-f, --file <schemaFile>",
    "Path to `schema.prisma` file",
    "./prisma/schema.prisma",
  )
  .option(
    "-c, --config-file <configFile>",
    "Path to configuration file",
    "./prisma/schema-fixer.config.js",
  )
  .option(
    "-n, --dry-run",
    "Show changes in the console instead of modifying the file",
    false,
  )
  .version(version);

program.parse(process.argv);

const options = program.opts();

// TODO
console.log(`- schema file: ${options.file}`);
console.log(`- config file: ${options.configFile}`);
console.log(`- dry run: ${options.dryRun}`);

fix("", { rules: {} });
