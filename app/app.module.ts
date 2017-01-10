import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http, Response, Headers, RequestOptions } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import {APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from '@angular/common';

import { IRCService } from './irc.service';
import { TwitchService } from './twitch.service';
import { AppComponent }   from './app.component';
import { AppTitleComponent }   from './app-title.component';
import { BrowserComponent }   from './browser.component';
import { ChatComponent }   from './chat.component';
import { ChannelComponent }   from './channel.component';

declare var io: any;

const appRoutes: Routes = [
  { path: '', component: BrowserComponent },
  { path: 'view/:channelName', component: ChannelComponent }
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports:      [ BrowserModule, HttpModule, RouterModule.forRoot(appRoutes) ],
  providers: [ IRCService, TwitchService, {provide: LocationStrategy, useClass: HashLocationStrategy} ],
  declarations: [ AppComponent, AppTitleComponent, ChatComponent, ChannelComponent, BrowserComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }