# electron-twitch-chat
A native Twitch Chat client written in Javascript and Typescript

It uses Electron (http://atom.electron.io) which provides a native application running Node and the Chrome renderer. 

The Node.js backend connects to Twitch's chat API (through the IRC protocol) and then it communicates to the Angular frontend through a web socket.

## Technologies Used

* Electron
 * Node.js
 * Chrome's rendering engine
* Angular - 2.2.0
* Socket.io - 1.4.8

--

![Chat Messages for channel](https://raw.githubusercontent.com/prasoc/electron-twitch-chat/master/screenshot1.png "Chat Messages for channel")

--

The chat gets parsed from the IRC socket, and then processed by the application.

Emotes are added from a list grabbed from the main Twitch emote API on startup, and also grabs them from BTTV to have a complete set of emoticons for the channel.

At the moment, it displays messages in the channel 100% correctly (including Unicode Emoji support!), but you aren't able to send messages.
--
