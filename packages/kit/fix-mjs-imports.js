const fs = require("fs");
const glob = require("glob");
const path = require("path");

// Function to read file contents
function readFileContents(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

// Function to write updated contents back to the file
function writeFileContents(filePath, contents) {
  fs.writeFileSync(filePath, contents, "utf8");
}

// Function to resolve the full path of the import
function resolveFullPath(filePath, importPath) {
  return path.resolve(path.dirname(filePath), importPath);
}

// Function to check if a path is a directory
function isDirectory(fullPath) {
  return fs.existsSync(fullPath) && fs.lstatSync(fullPath).isDirectory();
}

// Function to check if a file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Function to update import statements for directories and `..` or `.`
function updateDirectoryOrDotImport(fromKeyword, importPath, quote, fullPath) {
  const indexPath = path.join(fullPath, "index.mjs");
  if (fileExists(indexPath)) {
    console.log(
      `Updating import: ${fromKeyword}${importPath}${quote} to ${fromKeyword}${importPath}/index.mjs${quote}`,
    );
    return `${fromKeyword}${importPath}/index.mjs${quote}`;
  } else {
    console.log(
      `Import path ${importPath} does not have an index.mjs file: ${fromKeyword}${importPath}${quote}`,
    );
    return `${fromKeyword}${importPath}${quote}`;
  }
}

// Function to update import statements for files
function updateFileImport(fromKeyword, importPath, quote, fullPath) {
  const mjsPath = `${fullPath}.mjs`;
  if (fileExists(mjsPath)) {
    console.log(
      `Updating import: ${fromKeyword}${importPath}${quote} to ${fromKeyword}${importPath}.mjs${quote}`,
    );
    return `${fromKeyword}${importPath}.mjs${quote}`;
  } else {
    console.log(
      `File does not exist or is not a .mjs file: ${fromKeyword}${importPath}${quote}`,
    );
    return `${fromKeyword}${importPath}${quote}`;
  }
}

// Function to update import statements
function updateImportStatement(fromKeyword, importPath, quote, filePath) {
  const fullPath = resolveFullPath(filePath, importPath);

  if (importPath === ".." || importPath === "." || isDirectory(fullPath)) {
    return updateDirectoryOrDotImport(fromKeyword, importPath, quote, fullPath);
  } else if (!importPath.endsWith(".mjs")) {
    return updateFileImport(fromKeyword, importPath, quote, fullPath);
  }

  return `${fromKeyword}${importPath}${quote}`;
}

// Main function to update imports in .mjs files
function updateImports(filePath) {
  console.log("Processing file:", filePath);
  const contents = readFileContents(filePath);

  const updatedContents = contents.replace(
    /(from\s+['"])(\.\.?\/[^'"\s]+|\.|..)(['"])/g,
    (match, fromKeyword, importPath, quote) => {
      console.log(`Found import: ${match}`);
      return updateImportStatement(fromKeyword, importPath, quote, filePath);
    },
  );

  if (contents !== updatedContents) {
    console.log(`Updating file: ${filePath}`);
    writeFileContents(filePath, updatedContents);
  } else {
    console.log(`No changes needed for file: ${filePath}`);
  }
}

// Get all .mjs files in the dist directory
function getAllMjsFiles() {
  return glob.sync("dist/**/*.mjs");
}

// Update imports in each .mjs file
function updateAllImports() {
  const files = getAllMjsFiles();
  files.forEach(updateImports);
  console.log("Imports updated in .mjs files");
}

// Run the update process
updateAllImports();
