import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
// import { SwiperModule, SwiperConfigInterface,
//   SWIPER_CONFIG } from 'ngx-swiper-wrapper';
  // const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  //   observer: true,
  //   direction: 'horizontal',
  //   threshold: 50,
  //   spaceBetween: 5,
  //   slidesPerView: 4,
  //   centeredSlides: true
  //   };
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
 
  declarations: [HomePage],
  // providers: [
	// 	{
	// 	  provide: SWIPER_CONFIG,
	// 	  useValue: DEFAULT_SWIPER_CONFIG
  //   },
  // ],
  // schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class HomePageModule {}
