import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { uploadProfile } from './uploadProfile';

const routes: Routes = [
  {
    path: '',
    component: uploadProfile
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class uploadProfileRoutingModule {}
