import { Component, Input, Injectable } from '@angular/core';
import { ChatMessage } from './chat.component';

@Component({
    selector: 'chat-message',
    templateUrl: 'app/chat-message.component.html'
})
export class ChatMessageComponent {
    @Input() data: ChatMessage;

}