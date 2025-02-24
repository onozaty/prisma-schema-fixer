import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/cli.ts"],
  outfile: "dist/cli.mjs",
  platform: "node",
  bundle: true,
  packages: "external",
  format: "esm",
  sourcemap: true,
});
