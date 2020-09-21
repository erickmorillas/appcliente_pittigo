import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatClientePage } from './chat-cliente';

@NgModule({
  declarations: [
    ChatClientePage,
  ],
  imports: [
    IonicPageModule.forChild(ChatClientePage),
  ],
})
export class ChatClientePageModule {}
