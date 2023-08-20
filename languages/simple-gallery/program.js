Alright, I've added comments to explain each part of the code:

```javascript
// Import necessary modules
const fs = require('fs');
const path = require('path');

// Read the configuration file and split it by line
const config = fs.readFileSync('config.txt', 'utf-8').split('\n');

// Extract the directory path from the first line of the config
const dirPath = path.join(__dirname, config[0]);
// Extract the valid image extensions from the second line of the config
const extensions = config[1].split(',');

// Extract the columns to display from the third line of the config
const columns = config[2].split(',');

// Initialize an empty array to store image metadata
const images = [];

// Read each file in the directory
fs.readdirSync(dirPath).forEach(file => {
  // Get the file extension
  const ext = path.extname(file).substring(1);

  // Check if the file extension is in the list of valid extensions
  if (extensions.includes(ext)) {
    // Obtain properties of the file
    const stats = fs.statSync(`${dirPath}/${file}`);

    // Create an image metadata object
    const image = {
      'src': `${dirPath}/${file}`, // Full path to the image
      'name_full': file,           // Full file name
      'name': path.parse(file).name, // File name without extension
      'extension': ext,            // File extension
      'size': stats.size,          // File size
      'date_created': stats.birthtime, // Creation date
      'date_updated': stats.mtime  // Last modification date
    };

    // Add the image metadata to the images array
    images.push(image);
  }
});

// Start creating the HTML content

// Specify the doctype and character encoding for UTF-8
let html = '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n</head>\n<body>\n';

// Start the HTML table
html += '<table>';

// Add table headers based on the columns specified in the config
html += '<tr>';
columns.forEach(col => {
  html += `<th>${col}</th>`;
});
html += '</tr>';

// Add each image and its metadata as rows in the table
images.forEach(image => {
  html += '<tr>';
  columns.forEach(col => {
    if (col === 'Image') {
      // Separate the directory path from the filename
      let dirPart = path.dirname(path.relative(__dirname, image['src']));
      // Encode the filename to handle special characters
      let filePart = encodeURIComponent(path.basename(image['src']));

      // Construct the final path to the image
      let imagePath = path.join(dirPart, filePart);

      // Add the image to the table
      html += `<td style="vertical-align:top;"><img src="${imagePath}" width="200"></td>`;
    } else {
      // Display other metadata with formatting
      let textValue = image[col.toLowerCase()];
      let parts = textValue.split(' ');
      // If there's a space, split at the space and make text after it bold
      if (parts.length > 1) {
        textValue = parts[0] + '<br><b>' + parts.slice(1).join(' ') + '</b>';
      }
      html += `<td style="vertical-align:top;">${textValue}</td>`;
    }
  });
  html += '</tr>';
});

// Close the table
html += '</table>';

// Close the body and html tags
html += '\n</body>\n</html>';

// Write the generated HTML content to a file
fs.writeFileSync('index.html', html);
```

Now, every part of the code is explained in comments, making it easy for any reader to understand its function and flow.
