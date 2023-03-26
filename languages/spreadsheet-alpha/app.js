let selectedCell;
let folderDropdown = document.getElementById('folderDropdown');
let tableContainer = document.getElementById('tableContainer');
let inputPopup = document.getElementById('inputPopup');
let cellInput = document.getElementById('cellInput');

fetch('/folders')
  .then(response => response.json())
  .then(folders => {
    folders.forEach(folder => {
      let option = document.createElement('option');
      option.value = folder;
      option.textContent = folder;
      folderDropdown.appendChild(option);
    });
  });

function loadTable() {
  let folder = folderDropdown.value;
  fetch(`/table?folder=${folder}`)
    .then(response => response.json())
    .then(tableData => {
      createTable(tableData);
    });
}

function createTable(tableData) {
  let table = document.createElement('table');
  for (let i = 0; i < tableData.rows; i++) {
    let tr = document.createElement('tr');
    for (let j = 0; j < tableData.columns; j++) {
      let td = document.createElement('td');
      td.addEventListener('dblclick', (e) => {
        openInputPopup(e.target);
      });

      let cellName = String.fromCharCode(65 + j) + (i + 1);
      td.textContent = tableData.data[cellName] || '';
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  tableContainer.innerHTML = '';
  tableContainer.appendChild(table);
}

function openInputPopup(cell) {
  selectedCell = cell;
  inputPopup.classList.remove('hidden');
  cellInput.value = '';
  cellInput.focus();
}

cellInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    submitInput();
  } else if (e.key === 'Escape') {
    closeInputPopup();
  }
});

function submitInput() {
  let inputValue = cellInput.value;
  let cellName = getCellName(selectedCell);
  let folder = folderDropdown.value;
  let isFormula = inputValue.startsWith('=');
  let extension = isFormula ? '.formula' : '.value';

  fetch(`/submit?folder=${folder}&cellName=${cellName}&value=${encodeURIComponent(inputValue)}&extension=${extension}`, {
    method: 'POST'
  }).then(() => {
    selectedCell.textContent = inputValue;
    closeInputPopup();
  });
}

function closeInputPopup() {
  inputPopup.classList.add('hidden');
}

function getCellName(cell) {
  let column = cell.cellIndex;
  let row = cell.parentElement.rowIndex;
  return String.fromCharCode(65 + column) + (row + 1);
}
