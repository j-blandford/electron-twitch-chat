import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Http, Response, Headers } from '@angular/http';

import { IChannel, IEmote } from './browser.component';
import { IRCService } from './irc.service';

@Injectable()
export class TwitchService {

    private clientId: string;

    private baseURL: string = "https://api.twitch.tv/kraken/"
    private headers: Headers;

    public emotes: Array<IEmote> = [];
    public bttvEmotes: Array<IEmote> = [];
    public bttvChannelEmotes: Array<IEmote> = [];
    public bttvSavedChannels: Array<IEmote> = [];

    constructor(public _http: Http, private _chat: IRCService) {
        this.clientId = ""; // insert client id here

        this.headers = new Headers({
            "Accept": "application/vnd.twitchtv.v3+json",
            "Client-ID": this.clientId
        });

        this.GetGlobalEmotes().subscribe(res => this.emotes = res);
        this.GetBTTVEmotes().subscribe(res => this.bttvEmotes = res);

        // "Global" channel emotes, forsen has a good number to grab :)
        this.GetBTTVChannelEmotes("forsenlol").subscribe(res => this.bttvSavedChannels = res);

    }

    // Passthrough IRC functions (allows the Twitch Service to focus on Twitch, not IRC)
    public JoinChat(channelName: string) {
        this._chat.JoinChannel(channelName);
        this.GetBTTVChannelEmotes(channelName).subscribe(res => this.bttvChannelEmotes = res);
    }

    public SendMessage(message: string) {
        this._chat.SendMessage(message);
    }
    public getChat$() {
        return this._chat.getChat$();
    }


    // GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
    public GetStreams(options: any): Observable<IChannel[]> {

        let url: string = this.baseURL + 'streams' + '?' + this.param(options);

        let req = this._http.get(url, { headers: this.headers })
            .map((res: Response) => res.json())
            .map((channels: Array<any>) => {
                let result: Array<IChannel> = [];

                if (channels) {
                    channels.streams.forEach((channel) => {
                        result.push({ displayName: channel.channel.display_name, viewers: channel.viewers });
                    })
                }

                return result;

            });

        return req;
    }

    public GetGlobalEmotes(): Observable<IEmote[]> {
        let url: string = this.baseURL + 'chat/emoticons';

        return this._http.get("https://twitchemotes.com/api_cache/v2/global.json")
            .map((res: Response) => res.json())
            .map((jsonResponse: Array<any>) => {
                let result: Array<IEmote> = [];

                if (jsonResponse.emotes) {

                    let templateUrl: string = jsonResponse.template['small'];

                    Object.keys(jsonResponse.emotes).forEach((emoticon) => {
                        result.push({ matchString: emoticon, url: templateUrl.replace(/\{image\_id\}/, jsonResponse.emotes[emoticon].image_id), id: jsonResponse.emotes[emoticon].image_id });
                    })
                }

                return result;

            });
    }

    public GetBTTVEmotes(): Observable<IEmote[]> {
        let url: string = this.baseURL + 'chat/emoticons';

        return this._http.get("https://api.betterttv.net/2/emotes")
            .map((res: Response) => res.json())
            .map((jsonResponse: Array<any>) => {
                let result: Array<IEmote> = [];

                if (jsonResponse.emotes) {

                    let templateUrl: string = "http:" + jsonResponse.urlTemplate.replace(/\{\{image\}\}/, "1x");

                    jsonResponse.emotes.forEach((emoticon) => {
                        result.push({ matchString: emoticon.code, url: templateUrl.replace(/\{\{id\}\}/, emoticon.id), id: emoticon.id });
                    })
                }

                return result;

            });
    }

    public GetBTTVChannelEmotes(channel: string): Observable<IEmote[]> {
        let url: string = this.baseURL + 'chat/emoticons';

        let req = this._http.get("https://api.betterttv.net/2/channels/" + channel)
            .map((res: Response) => res.json())
            .map((jsonResponse: Array<any>) => {
                let result: Array<IEmote> = [];

                if (jsonResponse.emotes) {

                    let templateUrl: string = "http:" + jsonResponse.urlTemplate.replace(/\{\{image\}\}/, "1x");

                    jsonResponse.emotes.forEach((emoticon) => {
                        result.push({ matchString: emoticon.code, url: templateUrl.replace(/\{\{id\}\}/, emoticon.id), id: emoticon.id });
                    })
                }

                return result;

            });

        return req;
    }


    public ParseChatMessage(message: string) {
        this.emotes.forEach((emoticon) => {
            message = message.replace(new RegExp(emoticon.matchString, 'g'), "<img src='" + emoticon.url + "'/>");
        });

        this.bttvEmotes.concat(this.bttvChannelEmotes, this.bttvSavedChannels).forEach((emoticon) => {
            message = message.split(emoticon.matchString).join(" <img class='emoticon bttv-" + emoticon.id + "' src='" + emoticon.url + "'/>");
        });
        return message;
    }


    // Turns a JS array into URL-readable string
    param(array) {
        var i = 0;
        var result = '';

        for (var name in array) {
            if (i !== 0) { result += '&'; }

            if (typeof array[name] === 'object') {
                var j = 0;
                for (var key in array[name]) {
                    result += name + '[' + key + ']=' + array[name][key];
                    if (j < Object.keys(array[name]).length - 1) { result += '&'; }
                }
                j++;
            }
            else { result += name + '=' + array[name]; }
            i++;
        }
        return result;
    }
}