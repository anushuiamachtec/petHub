import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InboxChatPage } from './inbox-chat.page';

const routes: Routes = [
  {
    path: '',
    component: InboxChatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InboxChatPageRoutingModule {}
