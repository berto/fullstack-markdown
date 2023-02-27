const fs = require('fs');
const path = require('path');

// read the config file
const config = fs.readFileSync('config.txt', 'utf-8').split('\n');

// extract the path and image extensions
const dirPath = path.join(__dirname, config[0]);
const extensions = config[1].split(',');

// extract the columns to display
const columns = config[2].split(',');

// create an empty array to store image metadata
const images = [];

// read the directory and filter files by extension
fs.readdirSync(dirPath).forEach(file => {
  const ext = path.extname(file).substring(1);
  if (extensions.includes(ext)) {
    // read the file properties
    const stats = fs.statSync(`${dirPath}/${file}`);

    // add properties to array
    const image = {};
    image['src'] = `${dirPath}/${file}`;
    image['name_full'] = file;
    image['name'] = path.parse(file).name;
    image['extension'] = ext;
    image['size'] = stats.size;
    image['date_created'] = stats.birthtime;
    image['date_updated'] = stats.mtime;
    images.push(image);
  }
});

// create the HTML table
let html = '<table>';
html += '<tr>';
columns.forEach(col => {
  html += `<th>${col}</th>`;
});
html += '</tr>';
images.forEach(image => {
  html += '<tr>';
  columns.forEach(col => {
    if (col === 'Image') {
      html += `<td><img src="${path.relative(__dirname, image['src'])}" width="200"></td>`;
    } else {
      html += `<td>${image[col.toLowerCase()]}</td>`;
    }
  });
  html += '</tr>';
});
html += '</table>';

// write the HTML to a file
fs.writeFileSync('gallery.html', html);
