// chatbot.component.ts
import { Component } from '@angular/core';
import {ChatbotService} from './chatbot.service';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  imports: [
    FormsModule,
    NgForOf
  ],
  standalone: true
})
export class ChatbotComponent {
  messages: { text: string, isUser: boolean }[] = [];
  newMessage: string = '';
  isOpen: boolean = false;

  constructor(private chatbotService: ChatbotService) {
    this.addBotMessage("Bonjour ! Comment puis-je vous aider aujourd'hui ?");
  }

  toggleChatbot() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (this.newMessage.trim() === '') return;

    this.addUserMessage(this.newMessage);
    const response = this.chatbotService.getResponse(this.newMessage);
    setTimeout(() => {
      this.addBotMessage(response);
    }, 500);

    this.newMessage = '';
  }

  private addUserMessage(text: string) {
    this.messages.push({ text, isUser: true });
  }

  private addBotMessage(text: string) {
    this.messages.push({ text, isUser: false });
  }
}
