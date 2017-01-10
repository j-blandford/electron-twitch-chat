import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http, Response, Headers, RequestOptions } from '@angular/http';
import { TwitchService } from './twitch.service';
import { ChatMessageComponent }   from './chat-message.component';
import { ChatComponent }   from './chat.component';

@NgModule({
  imports:      [ BrowserModule, HttpModule ],
  providers: [ TwitchService ],
  declarations: [ ChatComponent, ChatMessageComponent ],
  bootstrap:    [ ChatComponent ]
})
export class ChatModule { }