import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
if (!process.env.npm_execpath) throw new Error("Run npm ci from the repository root.");
const result = spawnSync(process.execPath, [process.env.npm_execpath, "run", "install:ci"], {
  cwd: path.join(root, "site"),
  env: process.env,
  stdio: "inherit",
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
