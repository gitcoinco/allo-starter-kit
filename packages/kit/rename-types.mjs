import { promises as fs } from "fs";
import { join } from "path";

/*
Tsup generates *.d.mts files for types and the apps doesn't resolve these correctly.

Added a script to rename from d.mts to d.ts.

Fix this issue and this file can be removed.

*/
async function renameFiles(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = join(dir, file.name);

    if (file.isDirectory()) {
      await renameFiles(fullPath);
    } else if (file.isFile() && file.name.endsWith(".d.mts")) {
      const newFullPath = fullPath.replace(/\.d\.mts$/, ".d.ts");
      await fs.rename(fullPath, newFullPath);
    }
  }
}

const startDir = process.argv[2] || ".";

renameFiles(startDir)
  .then(() => console.log("Renaming types complete."))
  .catch((err) => console.error("Error renaming types:", err));
