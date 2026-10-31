import { createReadStream } from "node:fs";
import { createGunzip } from "node:zlib";
import { Writable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { pathToFileURL } from "node:url";

export const archiveLimitBytes = 256 * 1024 * 1024;

export async function inspectDeploymentArchive(filename) {
  let expandedTarBytes = 0;
  await pipeline(createReadStream(filename), createGunzip(), new Writable({
    write(chunk, _encoding, callback) {
      expandedTarBytes += chunk.length;
      callback();
    },
  }));
  return { expandedTarBytes, limitBytes: archiveLimitBytes, headroomBytes: archiveLimitBytes - expandedTarBytes };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [filename, ...extra] = process.argv.slice(2);
  if (!filename || extra.length) {
    console.error("Usage: node scripts/check-deployment-archive.mjs ARCHIVE.tar.gz");
    process.exitCode = 2;
  } else {
    try {
      const result = await inspectDeploymentArchive(filename);
      console.log(JSON.stringify(result));
      if (result.headroomBytes < 0) {
        console.error("Deployment archive exceeds 256 MiB including tar headers and metadata.");
        process.exitCode = 1;
      }
    } catch (error) {
      console.error(`Cannot inspect deployment archive: ${error.message}`);
      process.exitCode = 1;
    }
  }
}
