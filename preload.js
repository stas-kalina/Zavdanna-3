const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    readCSV: (filePath) => ipcRenderer.invoke('file:readCSV', filePath),
    saveCSV: (filePath, data) => ipcRenderer.invoke('file:saveCSV', filePath)
});
// JavaScript source code
