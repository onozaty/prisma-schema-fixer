#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs";
import { dirname, join, resolve } from "path";
import { pathToFileURL } from "url";
import { version } from "../package.json";
import { Config } from "./config";
import { fix } from "./fixer";

const toAbsoultePath = (path: string): string => {
  return resolve(process.cwd(), path);
};

const loadConfigFile = async (configFilePath: string): Promise<Config> => {
  const absolutePath = toAbsoultePath(configFilePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Configuration file not found: ${configFilePath}`);
  }
  const module = await import(pathToFileURL(absolutePath).href);
  return module.default as Config;
};

const readPrismaSchema = (schemaFilePath: string): string => {
  const absolutePath = toAbsoultePath(schemaFilePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Schema file not found: ${schemaFilePath}`);
  }
  return fs.readFileSync(absolutePath, "utf-8");
};

const writePrismaSchema = (schemaFilePath: string, content: string) => {
  const absolutePath = toAbsoultePath(schemaFilePath);
  fs.writeFileSync(absolutePath, content, "utf-8");
};

const getDefaultSchemaPath = (): string => {
  const packageJson = JSON.parse(
    fs.readFileSync(resolve(process.cwd(), "package.json"), "utf-8"),
  );
  return packageJson.prisma?.schema || "prisma/schema.prisma";
};

const getDefaultConfigPath = (schemaFilePath: string): string => {
  const schemaDir = dirname(schemaFilePath);
  return join(schemaDir, "schema-fixer.config.mjs");
};

const run = async () => {
  const program = new Command();
  program
    .name("prisma-schema-fixer")
    .description("Fix schema.prisma according to the rules")
    .option(
      "-f, --file <schemaFile>",
      "Path to `schema.prisma` file",
      getDefaultSchemaPath(),
    )
    .option(
      "-c, --config-file <configFile>",
      "Path to configuration file",
      getDefaultConfigPath(getDefaultSchemaPath()),
    )
    .option(
      "-n, --dry-run",
      "Show changes in the console instead of modifying the file",
      false,
    )
    .version(version);

  program.parse(process.argv);

  const options = program.opts();

  try {
    const content = readPrismaSchema(options.file);
    const config = await loadConfigFile(options.configFile);
    const fixedContent = await fix(content, config);

    if (options.dryRun) {
      console.log(fixedContent);
    } else {
      if (content === fixedContent) {
        console.log("✅ No changes were necessary for the schema file.");
      } else {
        writePrismaSchema(options.file, fixedContent);
        console.log("✨ Schema file has been fixed and saved successfully.");
      }
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
};

run();
