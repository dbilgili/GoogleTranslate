// eslint-disable-next-line import/no-extraneous-dependencies
const { Tray, Menu, globalShortcut } = require('electron');
const path = require('path');

class TrayGenerator {
  constructor(mainWindow, store) {
    this.tray = null;
    this.mainWindow = mainWindow;
    this.store = store;
  }

  getWindowPosition = () => {
    const windowBounds = this.mainWindow.getBounds();
    const trayBounds = this.tray.getBounds();

    const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
    const y = Math.round(trayBounds.y + trayBounds.height);
    return { x, y };
  };

  setWinPosition = () => {
    const position = this.getWindowPosition();
    this.mainWindow.setPosition(position.x, position.y, false);
  }

  showWindow = () => {
    this.mainWindow.setVisibleOnAllWorkspaces(true);
    this.mainWindow.show();
    this.mainWindow.setVisibleOnAllWorkspaces(false);
  };

  toggleWindow = () => {
    if (this.mainWindow.isVisible()) {
      this.mainWindow.hide();
    } else {
      this.setWinPosition();
      this.showWindow();
      this.mainWindow.focus();
    }
  };

  toggleShortcut = (event) => {
    this.store.set('useShortcut', event)

    if (event) {
      globalShortcut.register('CommandOrControl+G', this.toggleWindow);
    } else {
      globalShortcut.unregister('CommandOrControl+G');

    }
  }

  rightClickMenu = () => {
    const menu = [
      {
        label: 'Remember languages',
        type: 'checkbox',
        checked: this.store.get('rememberLanguages'),
        click: (event) => this.store.set('rememberLanguages', event.checked),
      },
      {
        label: 'Clear on blur',
        type: 'checkbox',
        checked: this.store.get('clearOnBlur'),
        click: (event) => this.store.set('clearOnBlur', event.checked),
      },
      {
        type: 'separator'
      },
      {
        label: 'Launch at startup',
        type: 'checkbox',
        checked: this.store.get('launchAtStart'),
        click: (event) => this.store.set('launchAtStart', event.checked),
      },
      {
        label: 'Use CMD+G shortcut',
        type: 'checkbox',
        checked: this.store.get('useShortcut'),
        click: (event) => this.toggleShortcut(event.checked),
      },
      {
        type: 'separator'
      },
      {
        role: 'quit',
        accelerator: 'Command+Q'
      }
    ];

    this.tray.popUpContextMenu(Menu.buildFromTemplate(menu));
  }

  createTray = () => {
    this.tray = new Tray(path.join(__dirname, './assets/IconTemplate.png'));
    this.setWinPosition();

    this.tray.setIgnoreDoubleClickEvents(true);
    this.toggleShortcut(this.store.get('useShortcut'));

    this.tray.on('click', () => {
      this.toggleWindow();
    });

    this.tray.on('right-click', this.rightClickMenu);
  };
}

module.exports = TrayGenerator;
