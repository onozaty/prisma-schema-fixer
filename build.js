import esbuild from "esbuild";
import fs from "fs";

await esbuild.build({
  entryPoints: ["src/cli.ts"],
  outfile: "dist/cli.mjs",
  platform: "node",
  bundle: true,
  packages: "external",
  format: "esm",
  sourcemap: true,
});

// Copy template file to dist
fs.copyFileSync(
  "src/default-config.mjs.template",
  "dist/default-config.mjs.template",
);
