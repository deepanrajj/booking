import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaceDetailPageRoutingModule } from './place-detail-routing.module';

import { PlaceDetailPage } from './place-detail.page';
import {CreateBookingModule} from '../../../bookings/create-booking/create-booking.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceDetailPageRoutingModule,
    CreateBookingModule
  ],
  declarations: [PlaceDetailPage],
  providers: []
})
export class PlaceDetailPageModule {}
