import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutoLocationPage } from './auto-location.page';

const routes: Routes = [
  {
    path: '',
    component: AutoLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutoLocationPageRoutingModule {}
