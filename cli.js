const inquirer = require("inquirer");
const configuration = require("./modules.conf.js");

console.log(configuration);

function uniq(a) {
  var prims = { boolean: {}, number: {}, string: {} },
    objs = [];

  return a.filter(function(item) {
    var type = typeof item;
    if (type in prims)
      if (Object.prototype.hasOwnProperty.call(prims[type], item)) {
        return false;
      } else {
        prims[type][item] = true;
        return true;
      }
    else return objs.indexOf(item) >= 0 ? false : objs.push(item);
  });
}

function generateFileList(list) {
  var fileList = [];
  var file;
  for (var i = 0; i < list.length; i++) {
    fileList.push(list[i].name + ".js");
    console.log(list[i]);
    console.log(configuration[list[i].name]);
    for (var j = 0; j < configuration[list[i]].deps.length; j++) {
      file = configuration[list[i]].deps[j];
      configuration[file].type;
      fileList.push(configuration[file].type + "/" + ".js");
    }
  }
  fileList = uniq(fileList);
  return fileList;
}

/**
 * Ask use a few questions on command prompt
 * @returns {Promise} The promise with the result of the prompt
 */
function promptUser() {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "env",
        message: "Where does your code run?",
        default: ["browser"],
        choices: [
          { name: "Browser", value: "browser" },
          { name: "Node", value: "node" }
        ]
      },
      {
        type: "checkbox",
        name: "images",
        message: "Which ImageTypes should be supported?",
        default: ["jpeg_support", "bmp_support", "gif_support", "webp_support"],
        choices: [
          { name: "Jpeg", value: "jpeg_support" },
          { name: "Bmp", value: "bmp_support" },
          { name: "Gif", value: "gif_support" },
          { name: "WebP", value: "webp_support" }
        ]
      },
      {
        type: "checkbox",
        name: "modules",
        message: "Additional Modules",
        default: [
          "acroform",
          "annotations",
          "arabic",
          "autoprint",
          "context2d",
          "fileloading",
          "filters",
          "html",
          "javascript",
          "outline",
          "setlanguage",
          "svg",
          "total_pages",
          "utf8",
          "viewerpreferences",
          "xmp_metadata"
        ],
        choices: [
          { name: "Acroform", value: "acroform" },
          { name: "Annotations", value: "annotations" },
          { name: "Arabic Parser", value: "arabic" },
          { name: "Autoprint", value: "autoprint" },
          { name: "Context2d", value: "context2d" },
          { name: "File Loading", value: "fileloading" },
          { name: "Filters", value: "filters" },
          { name: "HTML", value: "html" },
          { name: "Javascript", value: "javascript" },
          { name: "Outline", value: "outline" },
          { name: "Language-Tagging", value: "setlanguage" },
          { name: "SVG", value: "svg" },
          { name: "TotalPages", value: "total_pages" },
          { name: "Unicode", value: "utf8" },
          { name: "ViewerPreferences", value: "viewerpreferences" },
          { name: "XMP Metadata", value: "xmp_metadata" }
        ]
      }
    ])
    .then(result => {
      console.log(generateFileList([...result.images, ...result.modules]));
    });
}

promptUser();
