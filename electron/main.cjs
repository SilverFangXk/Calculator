const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 900,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, '..', 'preload.js')
    }
  });

  win.loadURL('http://localhost:5174');
}
ipcMain.on('window-close', () => {
  if (win) win.close();
});

ipcMain.on('window-minimize', () => {
  if (win) win.minimize();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
