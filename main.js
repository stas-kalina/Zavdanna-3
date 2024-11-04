const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// ĳ������� ���� ��� ������ �����
ipcMain.handle('dialog:openFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'CSV Files', extensions: ['csv'] }]
    });
    if (canceled) {
        return null;
    } else {
        return filePaths[0];
    }
});

// ������� ����� CSV �����
ipcMain.handle('file:readCSV', async (event, filePath) => {
    const data = fs.readFileSync(filePath, 'utf8');
    return data;
});

// ����� � CSV ����
ipcMain.handle('file:saveCSV', async (event, filePath, data) => {
    fs.writeFileSync(filePath, data, 'utf8');
});
