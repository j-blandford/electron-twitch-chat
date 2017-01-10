var net = require('net');
var exports = module.exports = {};

exports.ircHost = 'irc.chat.twitch.tv';
exports.ircPort = 6667;
exports.currentChannel = '';
exports.twitchNick = '';
exports.twitchOauth = '';

exports.info = {
    names: [],
    nick: ''
}

exports.raw = function (data) {
	exports.socket.write(data + '\n', 'utf-8', function () {
		console.log('SENT -', data);
	});
};

exports.socket = new net.Socket();
exports.socket.on('connect', function () {
	console.log('Established new IRC connection to: '+exports.ircHost);
	setTimeout(function () {
        exports.raw('PASS '+exports.twitchOauth);
		exports.raw('NICK '+exports.twitchNick);
		exports.raw('CAP REQ :twitch.tv/tags');
	}, 1000);
});

exports.socket.on('data', function (data) {
	data = data.split('\n');
	for (var i = 0; i < data.length; i++) {
		console.log('RECV -', data[i]);
		if (data !== '') {
			exports.handle(data[i].slice(0, -1));
		}
	}
});

//handles incoming messages
exports.handle = function (data) {
	var i, info;
	for (i = 0; i < exports.listeners.length; i++) {
		info = exports.listeners[i][0].exec(data);
		if (info) {
			exports.listeners[i][1](info, data);
			if (exports.listeners[i][2]) {
				exports.listeners.splice(i, 1);
			}
		}
	}
};

exports.join = function (chan, callback) {
	if (callback !== undefined) {
		exports.on_once(new RegExp('^:' + exports.info.nick + '![^@]+@[^ ]+ JOIN :' + chan), callback);
	}
    exports.currentChannel = chan;
	exports.info.names[chan] = {};
	exports.raw('JOIN ' + chan);
};

exports.sendMessage = function(message, channel, callback) {

    exports.raw(':'+exports.twitchNick+'!'+exports.twitchNick+'@'+exports.twitchNick+'.tmi.twitch.tv PRIVMSG '+channel+' :'+message)
}

exports.listeners = [];
exports.on = function (data, callback) {
	exports.listeners.push([data, callback, false])
};
exports.on_once = function (data, callback) {
	exports.listeners.push([data, callback, true]);
};

// PING <-> PONG response
exports.on(/^PING \:(.*)$/i, function (info) {
	exports.raw('PONG :' + info[1]);
});