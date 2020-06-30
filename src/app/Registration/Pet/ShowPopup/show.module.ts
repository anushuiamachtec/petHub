import { SharedModule } from 'src/providers/SharedModule';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { showProfileRoutingModule } from './show-routing.module';
import { showProfile } from './show.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    showProfileRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [showProfile]
})
export class showProfileModule {}
