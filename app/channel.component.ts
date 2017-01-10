import { Component, Input, Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TwitchService } from './twitch.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ChatMessageComponent } from './chat-message.component';

@Component({
    selector: 'channel',
    templateUrl: 'app/channel.component.html'
})
export class ChannelComponent {
    public channelName = '';

    constructor(private _Twitch: TwitchService,
        private route: ActivatedRoute,
        private router: Router) {

        setTimeout(() => {
            this._Twitch.JoinChat(this.channelName.toLowerCase());
        }, 5000);

    }

    ngOnInit() {
        this.channelName = this.route.snapshot.params['channelName'];
    }

}