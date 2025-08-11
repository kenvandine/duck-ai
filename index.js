const { app, BrowserWindow, screen, Tray, Menu, nativeImage, ipcMain, shell} = require('electron');
const { join } = require('path');
const fs = require('fs');

let tray = null;
let win = null;
let autostart = false;
const appURL = 'https://duck.ai'
const icon = nativeImage.createFromPath(join(__dirname, '/assets/img/icon.png'));
const isTray = process.argv.includes('--tray');
const snapPath = process.env.SNAP
const snapUserData = process.env.SNAP_USER_DATA

function initializeAutostart() {
  if (fs.existsSync(snapUserData + '/.config/autostart/duck.ai.desktop')) {
    console.log('Autostart file exists')
    autostart = true;
  } else {
    console.log('Autostart file does not exist')
    autostart = false;
  }
}

function handleAutoStartChange() {
  if (autostart) {
    console.log("Enabling autostart");
    if (!fs.existsSync(snapUserData + '/.config/autostart')) {
      fs.mkdirSync(snapUserData + '/.config/autostart', recursive=true);
    }
    if (!fs.existsSync(snapUserData + '/.config/autostart/duck.ai.desktop')) {
      fs.copyFileSync(snapPath + '/com.github.kenvandine.duck.ai-autostart.desktop', snapUserData + '/.config/autostart/duck.ai.desktop');
    }
  } else {
    console.log("Disabling autostart");
    if (fs.existsSync(snapUserData + '/.config/autostart/duck.ai.desktop')) {
      fs.rmSync(snapUserData + '/.config/autostart/duck.ai.desktop');
    }
  }
}

function createWindow () {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { x, y, width, height } = primaryDisplay.bounds;

  // Log geometry information for easier debugging
  console.log(`Primary Screen Geometry - Width: ${width} Height: ${height} X: ${x} Y: ${y}`);

  win = new BrowserWindow({
    width: width * 0.6,
    height: height * 0.8,
    x: x + ((width - (width * 0.6)) / 2),
    y: y + ((height - (height * 0.8)) / 2),
    icon: icon,
    show: !isTray, // Start hiden if --tray
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      sandbox: false
    }
  });

  win.removeMenu();

  win.on('close', (event) => {
    event.preventDefault();
    win.hide();
  });

  ipcMain.on('log-message', (event, message) => {
    console.log('Log from preload: ', message);
  });

  // Open links with default browser
  ipcMain.on('open-external-link', (event, url) => {
    console.log('open-external-link: ', url);
    if (url) {
      shell.openExternal(url);
    }
  });

  // Listen for network status updates from the renderer process
  ipcMain.on('network-status', (event, isOnline) => {
    console.log(`Network status: ${isOnline ? 'online' : 'offline'}`);
    console.log("network-status changed: " + isOnline);
    if (isOnline) {
      win.loadURL(appURL);
    } else {
      win.loadFile('./assets/html/offline.html');
    }
  });

  //win.loadFile(join(__dirname, 'index.html'));
  win.loadURL(appURL);

  // Link clicks open new windows, let's force them to open links in
  // the default browser
  win.webContents.setWindowOpenHandler(({url}) => {
    console.log('windowOpenHandler: ', url);
    shell.openExternal(url);
    return { action: 'deny' }
  });

  win.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.key.toLowerCase() === 'r') {
      console.log('Pressed Control+R')
      event.preventDefault()
      win.loadURL(appURL);
    }
  })

  win.webContents.on('did-finish-load', () => {
    // Hide the sidebar menu
    win.webContents.executeJavaScript(`
      const sidemenu = document.getElementById('sidemenu');
      const btn = document.getElementById('aichat-side-menu-button');
      if (btn) {
        btn.style.display = 'none';
      }
   `);
    win.webContents.insertCSS(`
      ::-webkit-scrollbar {
        width: 5px;
        height: 12px;
      }
      ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    `);
  });

  //win.webContents.openDevTools();
}

// Ensure we're a single instance app
const firstInstance = app.requestSingleInstanceLock();

if (!firstInstance) {
  app.quit();
} else {
  app.on("second-instance", (event) => {
    console.log("second-instance");
    win.show();
  });
}

function createAboutWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { x, y, width, height } = primaryDisplay.bounds;

  const aboutWindow = new BrowserWindow({
    width: 500,
    height: 300,
    x: x + ((width - 500) / 2),
    y: y + ((height - 500) / 2),
    title: 'About',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    modal: true,  // Make the About window modal
    parent: win  // Set the main window as parent
  });

  aboutWindow.loadFile('./assets/html/about.html');
  aboutWindow.removeMenu();

  // Read version from package.json
  const packageJson = JSON.parse(fs.readFileSync(join(__dirname, 'package.json')));
  const appVersion = packageJson.version;
  const appDescription = packageJson.description;
  const appTitle = packageJson.title;
  const appBugsUrl = packageJson.bugs.url;
  const appHomePage = packageJson.homepage;
  const appAuthor = packageJson.author;

  // Send version to the About window
  aboutWindow.webContents.on('did-finish-load', () => {
    console.log("did-finish-load", appTitle);
    aboutWindow.webContents.send('app-version', appVersion);
    aboutWindow.webContents.send('app-description', appDescription);
    aboutWindow.webContents.send('app-title', appTitle);
    aboutWindow.webContents.send('app-bugs-url', appBugsUrl);
    aboutWindow.webContents.send('app-homepage', appHomePage);
    aboutWindow.webContents.send('app-author', appAuthor);
  });
  // Link clicks open new windows, let's force them to open links in
  // the default browser
  aboutWindow.webContents.setWindowOpenHandler(({url}) => {
    console.log('windowOpenHandler: ', url);
    shell.openExternal(url);
    return { action: 'deny' }
  });

  win.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.key.toLowerCase() === 'r') {
      console.log('Pressed Control+R')
      event.preventDefault()
      win.loadURL(appURL);
    }
  })
}

ipcMain.on('get-app-metadata', (event) => {
    const packageJson = JSON.parse(fs.readFileSync(join(__dirname, 'package.json')));
    const appVersion = packageJson.version;
    const appDescription = packageJson.description;
    const appTitle = packageJson.title;
    const appBugsUrl = packageJson.bugs.url;
    const appHomePage = packageJson.homepage;
    const appAuthor = packageJson.author;
    event.sender.send('app-version', appVersion);
    event.sender.send('app-description', appDescription);
    event.sender.send('app-title', appTitle);
    event.sender.send('app-bugs-url', appBugsUrl);
    event.sender.send('app-homepage', appHomePage);
    event.sender.send('app-author', appAuthor);
});

app.on('ready', () => {
  console.log(`Electron Version: ${process.versions.electron}`);
  console.log(`App Version: ${app.getVersion()}`);

  tray = new Tray(icon);
  // Ignore double click events for the tray icon
  tray.setIgnoreDoubleClickEvents(true)
  tray.on('click', () => {
    console.log("AppIndicator clicked");
    showOrHide();
  });

  // Ensure autostart is set properly at start
  initializeAutostart();

  const contextMenu = Menu.buildFromTemplate([
    {
      label: `Show/Hide Duck.ai`,
      icon: icon,
      click: () => {
        showOrHide();
      }
    },
    {
      label: 'Autostart',
      type: 'checkbox',
      checked: autostart,
      click: () => {
        autostart = contextMenu.items[1].checked;
        console.log("Autostart toggled: " + autostart);
        handleAutoStartChange();
        // We need to setContextMenu to get the state changed for checked
        tray.setContextMenu(contextMenu);
      }
    },
    { type: 'separator' },
    { label: 'About',
      click: () => {
        console.log("About clicked");
	createAboutWindow();
      }
    },
    { label: 'Quit',
      click: () => {
        console.log("Quit clicked, Exiting");
        app.exit();
      }
    },
  ]);

  tray.setToolTip('Duck.ai');
  tray.setContextMenu(contextMenu);

  createWindow();
});

function showOrHide() {
  console.log("showOrHide");
  if (win.isVisible()) {
    win.hide();
  } else {
    win.show();
  }
}

app.on('window-all-closed', () => {
  console.log("window-all-closed");
});

app.on('activate', () => {
  console.log("ACTIVATE");
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
