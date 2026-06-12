import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import esbuildPluginPino from "esbuild-plugin-pino";
import { rm } from "node:fs/promises";

globalThis.require = createRequire(import.meta.url);

const rootDir = path.dirname(fileURLToPath(import.meta.url));

async function buildServer() {
  const distDir = path.resolve(rootDir, "dist");
  await rm(path.resolve(distDir, "index.mjs"), { force: true });
  await rm(path.resolve(distDir, "index.mjs.map"), { force: true });

  await esbuild({
    entryPoints: [path.resolve(rootDir, "server/index.ts")],
    platform: "node",
    bundle: true,
    format: "esm",
    outdir: distDir,
    outExtension: { ".js": ".mjs" },
    logLevel: "info",
    external: [
      "*.node",
      "pg-native",
      "sharp",
      "bcrypt",
      "argon2",
      "fsevents",
      "canvas",
    ],
    sourcemap: "linked",
    plugins: [esbuildPluginPino({ transports: ["pino-pretty"] })],
    banner: {
      js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';

globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
`,
    },
  });
}

buildServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
