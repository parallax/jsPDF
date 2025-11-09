const deleteFolder = require("folder-delete");

try {
  deleteFolder("docs", { debugLog: false });
} catch (e) {}
