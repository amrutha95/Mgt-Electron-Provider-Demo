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
  } \
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
      await wallpaper.set('assets/wallpapers/busy.jpg');
      //Dark mode on
      addDarkTheme();
    } else {
      if (presence.availability === 'Offline') {
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
  if (!document.body.classList.contains('mgt-dark')) {
    document.body.classList.add('mgt-dark');
  }
  document.body.style.backgroundColor = 'black';
  document.body.style.backgroundImage = 'url("assets/wallpapers/focus.png")';
  titlebar.updateBackground(Color.BLACK);
}

function removeDarkTheme() {
  ipcRenderer.send('dark-mode-off');
  if (document.body.classList.contains('mgt-dark')) {
    document.body.classList.remove('mgt-dark');
  }
  document.body.style.backgroundColor = 'white';
  document.body.style.backgroundImage = 'none';
  // document.body.style.backgroundImage =
  //   "url('assets/wallpapers/background.jpg')";

  titlebar.updateBackground(Color.WHITE);
}

//Talk about provider states
//How to call the graph for presence
//How to update Mgt-Person
