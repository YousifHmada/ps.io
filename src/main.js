const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
require('electron-reload')(__dirname, '/../build/index.html');
let mainWindow;

function createWindow(){
    mainWindow = new BrowserWindow({ 
      width: 556,
      height: 448,
      resizable:false  ,
      backgroundColor: 'red',
      autoHideMenuBar:true,
      plugins:true,
      scrollBounce :true,

      });
    const startUrl = process.env.DEV_URL ||
    url.format({
      pathname: path.join(__dirname, '/../build/index.html'),
      protocol: 'file:',
      slashes: true
    });

    mainWindow.loadURL(startUrl);
    // mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);