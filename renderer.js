const fileInputButton = document.getElementById('fileInputButton');
const saveButton = document.getElementById('saveButton');
const tableBody = document.getElementById('tableBody');
let currentFilePath = '';

// Обробка події для вибору файлу
fileInputButton.addEventListener('click', async () => {
    currentFilePath = await window.electronAPI.openFile();
    if (currentFilePath) {
        const data = await window.electronAPI.readCSV(currentFilePath);
        displayCSVData(data);
    }
});

// Обробка події для збереження файлу
saveButton.addEventListener('click', async () => {
    if (currentFilePath) {
        const updatedData = getCSVDataFromTable();
        await window.electronAPI.saveCSV(currentFilePath, updatedData);
        alert('Файл збережено');
    }
});

// Відображення даних CSV у таблиці
function displayCSVData(data) {
    // Розділення на рядки за новими рядками, а потім на коми
    const rows = data.trim().split('\n').map(row => row.split(','));
    tableBody.innerHTML = '';

    rows.forEach((row, rowIndex) => {
        const tableRow = document.createElement('tr');
        row.forEach(cellData => {
            const cell = document.createElement('td');
            cell.textContent = cellData;
            tableRow.appendChild(cell);
        });

        // Додати кнопку для видалення рядка
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Видалити';
        deleteButton.addEventListener('click', () => {
            tableRow.remove();
        });

        const deleteCell = document.createElement('td');
        deleteCell.appendChild(deleteButton);
        tableRow.appendChild(deleteCell);

        tableBody.appendChild(tableRow);
    });
}

// Отримання даних із таблиці у форматі CSV
function getCSVDataFromTable() {
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    return rows.map(row => {
        const cells = Array.from(row.querySelectorAll('td:not(:last-child)'));
        return cells.map(cell => cell.textContent).join(','); // Залишаємо ',' як розділовий знак
    }).join('\n'); // Використовуємо '\n' для розділення рядків
}
