import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { createProfile } from './createProfile.page';

const routes: Routes = [
  {
    path: '',
    component: createProfile
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class createProfileRoutingModule {}
