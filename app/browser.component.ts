import { Component, Input, Injectable } from '@angular/core';
import { TwitchService } from './twitch.service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

export interface IChannel {
    viewers: number;
    displayName: string;
    //constructor(displayName: string, viewers: number);
}

export interface IEmote {
    //emoticon_set: number;
    // width: number;
    // height: number;
    id: string;
    url: string;
    matchString: string;
}

@Component({
    selector: 'game-browser',
    template: ` 
  <ul>
    <li *ngFor="let channel of channels"><strong><a [routerLink]="['/view', channel.displayName]">{{channel.displayName}}</a></strong> ({{channel.viewers}} viewers)</li>
  </ul>`
})
export class BrowserComponent {

    public channels: Array<IChannel> = [];


    constructor(private _Twitch: TwitchService) {

        this._Twitch.GetStreams({
            game: 'Hearthstone%3A%20Heroes%20of%20Warcraft',
            limit: 10
        }).subscribe(res => this.channels = res);

  
    }
}