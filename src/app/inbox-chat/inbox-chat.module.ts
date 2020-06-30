import { SharedModule } from './../../providers/SharedModule';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InboxChatPageRoutingModule } from './inbox-chat-routing.module';

import { InboxChatPage } from './inbox-chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    InboxChatPageRoutingModule
  ],
  declarations: [InboxChatPage]
})
export class InboxChatPageModule {}
