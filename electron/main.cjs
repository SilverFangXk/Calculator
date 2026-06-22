const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

console.log('GEMINI_API_KEY loaded:', !!process.env.GEMINI_API_KEY);

let genAI = null;
try {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} catch (initError) {
  console.error('Failed to initialize GoogleGenerativeAI:', initError);
}

const MODEL_NAME = "gemini-1.5-flash";
console.log('Using AI model:', MODEL_NAME);

// ✅ Must be before app.whenReady()
app.commandLine.appendSwitch('use-fake-ui-for-media-stream');
app.commandLine.appendSwitch('enable-speech-input');
app.commandLine.appendSwitch('unsafely-treat-insecure-origin-as-secure', 'http://localhost:5174');
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 900,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      allowRunningInsecureContent: true,
      preload: path.join(__dirname, '..', 'preload.js'),
    }
  });

  win.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media' || permission === 'microphone') {
      callback(true);
    } else {
      callback(false);
    }
  });

  win.webContents.openDevTools();
  win.loadURL('http://localhost:5174');
}

// --- WINDOW CONTROLS ---
ipcMain.on('window-close', () => { if (win) win.close(); });
ipcMain.on('window-minimize', () => { if (win) win.minimize(); });

// --- AI HANDLER ---
ipcMain.handle('ask-ai', async (event, prompt) => {
  try {
    if (!genAI) return "AI not available.";
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('AI Error:', error);
    return `Error: ${error.message}`;
  }
});

// --- APP LIFECYCLE ---
app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

if (!process.env.GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY.');
}