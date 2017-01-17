import { Component, Input, Injectable, NgZone } from '@angular/core';
import { Observable, Subscribable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import * as io from 'socket.io-client';
import * as $ from 'jquery';

import { TwitchService, IChannelInfo } from './twitch.service';
import { ChatMessageComponent } from './chat-message.component';

export interface ChatMessage {
    username: string;
    color: string;
    message: string;
    subscriber: boolean;
    prime: boolean;
}

@Component({
    selector: 'chat',
    templateUrl: 'app/chat.component.html',
})
export class ChatComponent {

    @Input() channelName: string = '';

    private chatConnection;

    public messages: Array<ChatMessage> = [];
    public channelInfo: IChannelInfo;

    constructor(private _Twitch: TwitchService, private _zone: NgZone) {
        this.channelInfo =  { profilePicture: "logo", streamTitle: "status", viewers: 0};
        
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

            this.messages.push({ username: data.username, color: data.color || '#DDDDDD', message: this._Twitch.ParseChatMessage(data.message), subscriber: data.subscriberLength > 0, prime: data.isPrime });

            console.log(data.subscriberLength > 0);

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

    ngOnInit() {
        this._Twitch.GetStreamInfo(this.channelName).subscribe(info => {
            this.channelInfo = info;
        });  
    }

}