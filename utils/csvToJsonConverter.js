const fs = require('fs');

function nestKeys(keys, values) {
  const result = {};
  keys.forEach((key, idx) => {
    const parts = key.trim().split('.');
    let current = result;
    parts.forEach((part, i) => {
      if (i === parts.length - 1) {
        current[part] = values[idx].trim();
      } else {
        current[part] = current[part] || {};
        current = current[part];
      }
    });
  });
  return result;
}

function parseCSV(filePath) {
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    return nestKeys(headers, values);
  });
}

module.exports = parseCSV;
