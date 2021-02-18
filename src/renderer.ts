// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.
import { Providers, ProviderState } from '@microsoft/mgt-element';
import { ElectronProvider } from '@microsoft/mgt-electron-provider/dist/Provider';
import '@microsoft/mgt-components';

import wallpaper = require('wallpaper');
import { ipcRenderer } from 'electron';
import { Titlebar, Color } from 'custom-electron-titlebar';
import { MgtPerson } from '@microsoft/mgt-components';
import * as path from 'path';

const titlebar = new Titlebar({
  backgroundColor: Color.WHITE,
});
// initialize the auth provider globally
Providers.globalProvider = new ElectronProvider();

Providers.globalProvider.onStateChanged(async (e) => {
  if (Providers.globalProvider.state === ProviderState.SignedIn) {
    checkPresence();
  }
});

async function checkPresence() {
  setInterval(async function () {
    //Calling presence API to fetch presence data
    const presence = await Providers.globalProvider.graph
      .api('/me/presence')
      .get();

    const person = document.querySelector('mgt-person') as MgtPerson;
    person.personPresence = presence;
    if (
      presence.availability === 'Busy' ||
      presence.availability === 'DoNotDisturb'
    ) {
      await wallpaper.set('assets/wallpapers/focus.jpg');
      //Dark mode on
      addDarkTheme();
    } else {
      if (presence.availability === 'Away') {
        await wallpaper.set('assets/wallpapers/offline.jpg');
      } else {
        await wallpaper.set(path.join('assets/wallpapers/free.jpg'));
      }
      //Dark mode off
      removeDarkTheme();
    }
  }, 5000);
}

function addDarkTheme() {
  ipcRenderer.send('dark-mode-on');
  document.body.classList.add('mgt-dark');
  document.body.style.backgroundColor = 'black';
  titlebar.updateBackground(Color.BLACK);
}

function removeDarkTheme() {
  ipcRenderer.send('dark-mode-off');
  document.body.classList.remove('mgt-dark');
  document.body.style.backgroundColor = 'white';
  document.body.style.backgroundImage = 'none';
  titlebar.updateBackground(Color.WHITE);
}
