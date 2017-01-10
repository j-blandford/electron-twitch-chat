import { Component, Input, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Http, Response, Headers } from '@angular/http';
import * as io from 'socket.io-client';
import { TwitchService } from './twitch.service';

@Injectable()
export class IRCService {
    private url: string = 'http://localhost:8181';
    private socket: SocketIOClient.Socket;

    private currentChannel: string;

    private id: number;

    constructor() {
        this.socket = io(this.url);

        this.socket.on('id', function (data) {
            console.info("Given IRC connection ID: " + data.id);
            this.id = data.id;
        });

    }

    public getChat$() {
        let observable = new Observable(observer => {

            this.socket.on('chat', (data) => {
                observer.next(data);
            });

            return () => {
                this.socket.disconnect();
            };
        })

        return observable;
    }

    public JoinChannel(channelName: string) {
        this.socket.emit('join', { id: this.id, channel: channelName });
        this.currentChannel = channelName;
    }

    public SendMessage(message: string) {
        this.socket.emit('send', { id: this.id, message: message });
    }

}