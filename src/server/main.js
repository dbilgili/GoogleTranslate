/* eslint-disable import/no-extraneous-dependencies */
const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain
} = require('electron');

const { is } = require('electron-util');

const path = require('path');
const Store = require('electron-store');
const TrayGenerator = require('./TrayGenerator');

let mainWindow = null;
let trayObject = null;

const gotTheLock = app.requestSingleInstanceLock();

const store = new Store();

const initStore = () => {
  if (store.get('launchAtStart') === undefined) {
    store.set('launchAtStart', true);
  }

  if (store.get('rememberLanguages') === undefined) {
    store.set('rememberLanguages', true);
  }

  if (store.get('clearOnBlur') === undefined) {
    store.set('clearOnBlur', true);
  }
};

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    transparent: true,
    width: 500,
    height: 370,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: is.development,
    webPreferences: {
      webviewTag: true,
      devTools: is.development,
      nodeIntegration: true,
      backgroundThrottling: false
    }
  });

  if (is.development) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    mainWindow.loadURL(`file://${path.join(__dirname, '../../src/client/index.html')}`);
  } else {
    mainWindow.loadURL(`file://${path.join(__dirname, '../../src/client/index.html')}`);
  }

  mainWindow.on('blur', () => {
    if (!mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide();
    }
    if (store.get('clearOnBlur')) {
      mainWindow.webContents.send('CLEAR_TEXT_AREA');
    }
  });
};

const createTray = () => {
  trayObject = new TrayGenerator(mainWindow, store);
  trayObject.createTray();
};

const savePreferences = () => {
  ipcMain.on('HASH', (event, arg) => {
    store.set('preferences', arg);
  });
};

const applyPreferences = () => {
  if (store.get('preferences') !== undefined && store.get('rememberLanguages')) {
    mainWindow.webContents.send('SAVED_HASH', store.get('preferences'));
  }
};

if (!gotTheLock) {
  app.quit();
} else {
  app.on('ready', () => {
    initStore();
    createMainWindow();
    createTray();
    savePreferences();

    mainWindow.webContents.on('dom-ready', applyPreferences);

    mainWindow.webContents.on('did-fail-load', () => console.log('fail'));

    if (!is.development) {
      globalShortcut.register('Command+R', () => null);
    }

    globalShortcut.register('CommandOrControl+G', () => {
      trayObject.toggleWindow();
    });
  });

  app.on('second-instance', () => {
    if (mainWindow) {
      trayObject.showWindow();
    }
  });

  if (!is.development) {
    app.setLoginItemSettings({
      openAtLogin: store.get('launchAtStart'),
    });
  }

  app.dock.hide();
}
