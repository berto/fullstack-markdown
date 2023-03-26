const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/folders', (req, res) => {
  fs.readdir('.', (err, files) => {
    if (err) {
      res.status(500).send('Error reading directory');
      return;
    }

    const folders = files.filter(file => file.endsWith('.spreadsheet') && fs.statSync(file).isDirectory());
    res.json(folders);
  });
});

app.get('/table', (req, res) => {
  const folder = req.query.folder;
  if (!folder) {
    res.status(400).send('Folder not specified');
    return;
  }

  fs.readdir(folder, (err, files) => {
    if (err) {
      res.status(500).send('Error reading folder');
      return;
    }

    const valueFiles = files.filter(file => file.endsWith('.value'));

    let columns = 5;
    let rows = 5;
    let data = {};

    valueFiles.forEach(file => {
      const address = file.split('.')[0];
      const column = address.charCodeAt(0) - 65;
      const row = parseInt(address.slice(1)) - 1;

      columns = Math.max(columns, column + 1);
      rows = Math.max(rows, row + 1);

      const content = fs.readFileSync(path.join(folder, file), 'utf8');
      data[address] = content;
    });

    res.json({
      columns: Math.min(columns, 26),
      rows: Math.min(rows, 99),
      data
    });
  });
});

app.post('/submit', (req, res) => {
  const folder = req.query.folder;
  const cellName = req.query.cellName;
  const value = req.query.value;
  const extension = req.query.extension;

  if (!folder || !cellName || !value || !extension) {
    res.status(400).send('Missing parameters');
    return;
  }

  const filePath = path.join(folder, `${cellName}${extension}`);
  const deleteFormulaPath = path.join(folder, `${cellName}.formula`);

  if (fs.existsSync(deleteFormulaPath)) {
    fs.unlinkSync(deleteFormulaPath);
  }

  fs.writeFileSync(filePath, value, 'utf8');
  res.status(200).send('Value saved');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
