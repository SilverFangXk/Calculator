const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    closeWindow: () => ipcRenderer.send('window-close'),
    minimizeWindow: () => ipcRenderer.send('window-minimize')
});


// agent part

contextBridge.exposeInMainWorld('aiAPI', {
    ask: (prompt) => ipcRenderer.invoke('ask-ai', prompt)
});

