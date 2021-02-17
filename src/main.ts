import { app, BrowserWindow, ipcMain, IpcMain, nativeTheme } from 'electron';
import * as path from 'path';
import {
  ElectronAuthenticator,
  MsalElectronConfig,
} from '@microsoft/mgt-electron-provider/dist/Authenticator';
import {
  FilePersistenceWithDataProtection,
  DataProtectionScope,
  KeychainPersistence,
  LibSecretPersistence,
  PersistenceCachePlugin,
} from '@azure/msal-node-extensions';

async function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    titleBarStyle: 'hidden',
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
    width: 800,
  });
  const cachePath = './data/cache.json'; //Change this if needed
  const filePersistence = await createPersistence(cachePath);
  const config: MsalElectronConfig = {
    clientId: 'e5774a5b-d84d-4f30-892e-c4f73a503943',
    mainWindow: mainWindow, //This is the BrowserWindow instance that requires authentication
    scopes: [
      'user.read',
      'user.read',
      'people.read',
      'user.readbasic.all',
      'contacts.read',
      'presence.read.all',
      'presence.read',
      'user.read.all',
      'calendars.read',
      'Sites.Read.All',
      'Sites.ReadWrite.All',
    ],
    cachePlugin: new PersistenceCachePlugin(filePersistence),
  };
  ElectronAuthenticator.initialize(config);

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../index.html'));
  mainWindow.maximize();
}

ipcMain.on('dark-mode-on', () => {
  if (nativeTheme.themeSource !== 'dark') {
    nativeTheme.themeSource = 'dark';
  }
});
ipcMain.on('dark-mode-off', () => {
  if (nativeTheme.themeSource === 'dark') {
    nativeTheme.themeSource = 'light';
  }
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

async function createPersistence(cachePath: string) {
  // On Windows, uses a DPAPI encrypted file
  if (process.platform === 'win32') {
    return FilePersistenceWithDataProtection.create(
      cachePath,
      DataProtectionScope.CurrentUser
    );
  }

  // On Mac, uses keychain.
  if (process.platform === 'darwin') {
    return KeychainPersistence.create(cachePath, 'serviceName', 'accountName'); // Replace serviceName and accountName
  }

  // On Linux, uses  libsecret to store to secret service. Libsecret has to be installed.
  if (process.platform === 'linux') {
    return LibSecretPersistence.create(cachePath, 'serviceName', 'accountName'); // Replace serviceName and accountName
  }

  throw new Error('Could not create persistence. Platform not supported');
}

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
