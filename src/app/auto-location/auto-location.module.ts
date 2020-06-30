import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AutoLocationPageRoutingModule } from './auto-location-routing.module';
import { AutoLocationPage } from './auto-location.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AutoLocationPageRoutingModule
  ],
  declarations: [AutoLocationPage]
})
export class AutoLocationPageModule {}
