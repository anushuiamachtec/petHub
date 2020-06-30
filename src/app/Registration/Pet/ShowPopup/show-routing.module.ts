import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { showProfile } from './show.page';

const routes: Routes = [
  {
    path: '',
    component: showProfile
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class showProfileRoutingModule {}
