const fs = require('fs/promises');
const path = require('path');

const readFileFromPath = async function (inputPath){
  const filePath = path.join(__dirname, inputPath);

  const content = await fs.readFile(filePath, 'utf8');

  return content;

}

module.exports = { readFileFromPath };