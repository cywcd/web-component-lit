import { watch } from 'chokidar';
import { existsSync, readdirSync, statSync, writeFile, unlink } from 'fs';
console.log('start');
const matchReg = /\.scss$/;
const cache = new Map();
const dir = './src/components';
import { join as _join } from 'path';
var join = _join;
import { processString } from 'uglifycss';

import * as sass from 'sass';

function isFileExisted(filePath) {
  return existsSync(filePath);
}

function escapeContent(content) {
  return content.replace(/\\([^\s])/g, '\\\\$1');
}

function getCssFiles(jsonPath) {
  let cssFiles = [];
  function findJsonFile(path) {
    let files = readdirSync(path);
    files.forEach(function (item) {
      let fPath = join(path, item);
      let stat = statSync(fPath);
      if (stat.isDirectory() === true) {
        findJsonFile(fPath);
      }
      if (stat.isFile() === true && matchReg.test(fPath)) {
        cssFiles.push(fPath);
      }
    });
  }
  findJsonFile(jsonPath);
  return cssFiles;
}

const writeCssToFile = (filePath) => {
  setTimeout(function () {
    try {
      let result = sass.compile(filePath);
      const cssContent = escapeContent(result.css.toString());
      let cssContentMin = processString(cssContent);
      var oldData = cache.get(filePath);
      const d = `import {css} from 'lit';\nexport default css\`${cssContentMin}\`; `;
      if (oldData == undefined || oldData != d) {
        writeFile(filePath + '.ts', d, function (err) {
          if (!err) {
            console.log(`write css to ${filePath + '.ts'} success `);
          } else {
            console.warn(`write css to ${filePath + '.ts'} fail `)
          }
        });
      }
    } catch (ex) {
      console.error(ex);
    }
  }, 100);

};



const cssFiles = getCssFiles(dir);
cssFiles.forEach((filePath) => {
  if (!isFileExisted(filePath + ".ts")) {
    writeCssToFile(filePath);
  }
});



// One-liner for current directory
watch(dir, {
  ignored: /\.[tj]s$/
}).on('change', (path) => {
  if (matchReg.test(path)) {
    writeCssToFile(path);
  }
}).on('unlink', (filepath) => {
  unlink(filepath + '.ts', (error) => {
    if (!error) {
      console.log('delete file  success ');
    }

  });
});