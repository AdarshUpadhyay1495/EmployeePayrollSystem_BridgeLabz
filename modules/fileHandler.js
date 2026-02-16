const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../employees.json');

const read = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading employees file:', error.message);
    return [];
  }
};

const write = async (data) => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing employees file:', error.message);
    return false;
  }
};

module.exports = { read, write };
