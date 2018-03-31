const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow(){
    mainWindow = new BrowserWindow({ 
      width: 486,
      height: 476,
      resizable:false  ,
      autoHideMenuBar:true,
      plugins:true,
      scrollBounce :true,
      backgroundColor:'#f3eaf1'
      });
    const startUrl = process.env.DEV_URL ||
    url.format({
      pathname: path.join(__dirname, '/../build/index.html'),
      protocol: 'file:',
      slashes: true
    });

    mainWindow.loadURL(startUrl);
    //mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);
