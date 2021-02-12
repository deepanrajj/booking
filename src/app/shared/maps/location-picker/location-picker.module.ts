import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import {LocationPickerComponent} from './location-picker.component';
import {MapModalModule} from '../map-modal/map-modal.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MapModalModule
  ],
  declarations: [LocationPickerComponent],
  exports: [
    LocationPickerComponent
  ],
  entryComponents: [LocationPickerComponent]
})
export class LocationPickerModule {}
