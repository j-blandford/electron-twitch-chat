import { Component, Input, Injectable, NgZone } from '@angular/core';
import { Observable, Subscribable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import * as io from 'socket.io-client';
import * as $ from 'jquery';

import { TwitchService } from './twitch.service';
import { ChatMessageComponent } from './chat-message.component';

export interface ChatMessage {
    username: string;
    color: string;
    message: string;
}

@Component({
    selector: 'chat',
    templateUrl: 'app/chat.component.html',
})
export class ChatComponent {

    @Input() channelName: string = '';

    private chatConnection;

    public messages: Array<ChatMessage> = [];

    constructor(private _Twitch: TwitchService, private _zone: NgZone) {
        this.chatConnection = this._Twitch.getChat$().subscribe(message => {
            this.AddMessage(message);

            this._zone.run(() => {
                this.messages = this.messages;
            });

        });
    }

    public AddMessage(data) {
        if (data.username != '' && data.message != '') {

            if(this.messages.length > 200) {
                this.messages.shift();
            }

            this.messages.push({ username: data.username, color: data.color || '#DDDDDD', message: this._Twitch.ParseChatMessage(data.message) });

            $(".scrollbox").each((index, element) => {
                element.scrollTop = element.scrollHeight + 60;
            });
        }
    }

    public SendKappa() {
        this._Twitch.SendMessage('KappaPride Kappa');
    }


    ngOnDestroy() {
        this.chatConnection.unsubscribe();
    }

}