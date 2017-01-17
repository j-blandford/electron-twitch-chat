const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

var server = require('http').createServer(function(req, res) {})
    socket = require('socket.io')(server, {});

var ircTable = [];

// TEMPORARY -------------
var irc = require('./irc.js');

irc.socket.setEncoding('utf-8');
irc.socket.setNoDelay();
irc.socket.connect(irc.ircPort, irc.ircHost);
// ------------------------

server.listen(8181);

socket.on('connection', function(socket) {
      console.log('connected to client');

      ircTable.push(irc); // Keep track of all IRC sockets made

      socket.emit('id', {id: ircTable.length-1});
      // socket.on('my other event', function(data) {
      //     console.log(data);
      // });

      
      // CHAT COMMENT, first capture group is username, second capture group is message.
      irc.on(/^@badges=(.*);color=(.*);display-name=(.*);emotes=.*;subscriber=(\d*);.*PRIVMSG #\w* :(.*)$/gmiu, function(info) {
      
          var badges = info[1];

          var isPrime = badges.match(/premium\/1/gmi) !== null || badges.match(/turbo\/1/gmi) !== null ;

          socket.emit('chat', {username: info[3], message: info[5], badges: [], color: info[2], subscriberLength: info[4], isPrime: isPrime });
          console.log(info[1]+": "+info[3]);
      });

      // irc.on(/^\:(.*)!.+\ PRIVMSG .* \:\!ping$/gmi, function(info) {
      //     //socket.emit('chat', {username: info[1], message: info[2]});

      //     console.log("PONG");
      //     setTimeout(function() {
      //       ircTable[0].sendMessage("/me PONG! :D", ircTable[0].currentChannel);
      //     }, 100);
      // });

      // irc.on(/PagChomp/gmi, function(info) {
      //     //socket.emit('chat', {username: info[1], message: info[2]});
      //     ircTable[0].sendMessage("/me PogChamp", ircTable[0].currentChannel);

      // });

      // irc.on(/KKaper/gmi, function(info) {
      //     //socket.emit('chat', {username: info[1], message: info[2]});
      //     ircTable[0].sendMessage("/me KKaper", ircTable[0].currentChannel);

      // });
      

      socket.on('send', function(data) {
        ircTable[0].sendMessage(data.message, ircTable[0].currentChannel);
      });


      socket.on('join', function(data) {
        console.log("--------> JOINING: #"+data.channel);
        ircTable[0].join('#'+data.channel);
      });
});

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

