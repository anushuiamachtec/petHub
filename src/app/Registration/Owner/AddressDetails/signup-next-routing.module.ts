import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupNextPage } from './signup-next.page';

const routes: Routes = [
  {
    path: '',
    component: SignupNextPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupNextPageRoutingModule {}
