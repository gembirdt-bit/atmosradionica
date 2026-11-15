/* Atmos Radionica — most između Windows programa i aplikacije.
   Aplikacija (sajt) dobija samo jednu funkciju: atmosSaob.read() — čitanje saobraćajne sa čitača kartica. */
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('atmosSaob', { read: () => ipcRenderer.invoke('saob:read') });
