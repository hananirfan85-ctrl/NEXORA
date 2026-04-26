const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'public/logo.png'),
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Start with deployed URL as user requested, or local if provided. 
  // We'll point to the deployed Vercel/Render URL or simple localhost fallback since it's a web wrapper for the POS.
  win.loadURL("https://nexapossystem.vercel.app/").catch(() => {
     win.loadURL("http://localhost:3000"); // fallback
  });
  
  // Hide menu bar for more native app feel
  win.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
