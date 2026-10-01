import { spawnSync } from "node:child_process";
import { cpSync, existsSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const app = path.join(root, "site");
const manifest = directory => JSON.parse(readFileSync(path.join(directory, ".openai/hosting.json"), "utf8"));
const rootManifest = manifest(root);
const appManifest = manifest(app);
if (JSON.stringify(rootManifest) !== JSON.stringify(appManifest)) {
  throw new Error("Root and site hosting manifests must match before deployment.");
}
const result = spawnSync(process.execPath, [path.join(app, "scripts/run-framework.mjs"), "build"], {
  cwd: app,
  env: process.env,
  stdio: "inherit",
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
const source = path.join(app, "dist");
if (!existsSync(path.join(source, "server/index.js")) ||
    !existsSync(path.join(source, "client")) ||
    JSON.stringify(manifest(source)) !== JSON.stringify(rootManifest)) {
  throw new Error("The application did not produce a complete matching Worker build.");
}
const destination = path.join(root, "dist");
if (path.dirname(destination) !== path.resolve(root) || path.basename(destination) !== "dist") {
  throw new Error("Invalid deployment output directory.");
}
rmSync(destination, { recursive: true, force: true });
cpSync(source, destination, { recursive: true });
console.log("Site Worker output prepared at repository-root dist/.");
