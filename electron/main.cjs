const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

console.log('GEMINI_API_KEY loaded:', !!process.env.GEMINI_API_KEY);

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Choose ONE model (clean + consistent)
const MODEL_NAME = "gemini-1.5-flash";
console.log('Using AI model:', MODEL_NAME);

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

// --- WINDOW CONTROLS ---

ipcMain.on('window-close', () => {
  if (win) win.close();
});

ipcMain.on('window-minimize', () => {
  if (win) win.minimize();
});

// --- AI HANDLER ---

ipcMain.handle('ask-ai', async (event, prompt) => {
  try {

    // 👇 DEBUG AVAILABLE MODELS
    const models = await genAI.listModels();
    console.log("AVAILABLE MODELS:");
    models.forEach(m => console.log(m.name));

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent(prompt);
    return result.response.text();

  } catch (error) {
    console.error('AI Error:', error);
    return "Sorry, I couldn't process that.";
  }
});

// --- APP LIFECYCLE ---

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

if (!process.env.GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY. Please add it to .env and restart Electron.');
}