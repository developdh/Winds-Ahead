import { execFileSync } from "node:child_process";
import fs from "node:fs";
const base = process.env.BASE_SHA;
if (!base || !/^[a-f0-9]{40}$/.test(base))
  throw new Error("A full BASE_SHA is required");
const file = "site/content/forecasts.json";
let old;
try {
  old = execFileSync("git", ["show", `${base}:${file}`], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
} catch {
  console.log("The base does not contain the new forecast file.");
  process.exit(0);
}
const before = JSON.parse(old).revisions;
const after = JSON.parse(
  fs.readFileSync("content/forecasts.json", "utf8"),
).revisions;
for (const previous of before) {
  const record = after.find(
    (f) => f.id === previous.id && f.revision === previous.revision,
  );
  if (JSON.stringify(record) !== JSON.stringify(previous))
    throw new Error(
      `Preserve ${previous.id} revision ${previous.revision}; append a correction instead`,
    );
}
console.log("Existing forecast history is unchanged.");
