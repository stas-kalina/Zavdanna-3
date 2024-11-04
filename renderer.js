const fileInputButton = document.getElementById('fileInputButton');
const saveButton = document.getElementById('saveButton');
const tableBody = document.getElementById('tableBody');
let currentFilePath = '';

// ������� ��䳿 ��� ������ �����
fileInputButton.addEventListener('click', async () => {
    currentFilePath = await window.electronAPI.openFile();
    if (currentFilePath) {
        const data = await window.electronAPI.readCSV(currentFilePath);
        displayCSVData(data);
    }
});

// ������� ��䳿 ��� ���������� �����
saveButton.addEventListener('click', async () => {
    if (currentFilePath) {
        const updatedData = getCSVDataFromTable();
        await window.electronAPI.saveCSV(currentFilePath, updatedData);
        alert('���� ���������');
    }
});

// ³���������� ����� CSV � �������
function displayCSVData(data) {
    // ��������� �� ����� �� ������ �������, � ���� �� ����
    const rows = data.trim().split('\n').map(row => row.split(','));
    tableBody.innerHTML = '';

    rows.forEach((row, rowIndex) => {
        const tableRow = document.createElement('tr');
        row.forEach(cellData => {
            const cell = document.createElement('td');
            cell.textContent = cellData;
            tableRow.appendChild(cell);
        });

        // ������ ������ ��� ��������� �����
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '��������';
        deleteButton.addEventListener('click', () => {
            tableRow.remove();
        });

        const deleteCell = document.createElement('td');
        deleteCell.appendChild(deleteButton);
        tableRow.appendChild(deleteCell);

        tableBody.appendChild(tableRow);
    });
}

// ��������� ����� �� ������� � ������ CSV
function getCSVDataFromTable() {
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    return rows.map(row => {
        const cells = Array.from(row.querySelectorAll('td:not(:last-child)'));
        return cells.map(cell => cell.textContent).join(','); // �������� ',' �� ��������� ����
    }).join('\n'); // ������������� '\n' ��� ��������� �����
}
