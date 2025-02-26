import { Command } from "commander";
import fs from "fs";
import { resolve } from "path";
import { pathToFileURL } from "url";
import { version } from "../package.json";
import { Config } from "./config";
import { fix } from "./fixer";

const toAbsoultePath = (path: string): string => {
  return resolve(process.cwd(), path);
};

const loadConfigFile = async (configFilePath: string): Promise<Config> => {
  const absolutePath = toAbsoultePath(configFilePath);
  const module = await import(pathToFileURL(absolutePath).href);
  return module.default as Config;
};

const readPrismaSchema = (schemaFilePath: string): string => {
  const absolutePath = toAbsoultePath(schemaFilePath);
  return fs.readFileSync(absolutePath, "utf-8");
};

const writePrismaSchema = (schemaFilePath: string, content: string) => {
  const absolutePath = toAbsoultePath(schemaFilePath);
  fs.writeFileSync(absolutePath, content, "utf-8");
};

const run = async () => {
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

  const config = await loadConfigFile(options.configFile);
  const content = readPrismaSchema(options.file);
  const fixedContent = await fix(content, config);

  if (options.dryRun) {
    console.log(fixedContent);
  } else {
    if (content === fixedContent) {
      console.log("No changes were necessary for the schema file.");
    } else {
      writePrismaSchema(options.file, fixedContent);
      console.log("Schema file has been fixed and saved successfully.");
    }
  }
};

run();
